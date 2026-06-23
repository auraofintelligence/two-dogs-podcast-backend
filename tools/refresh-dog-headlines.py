#!/usr/bin/env python3
"""Refresh the Two Dogs weekly dog headline board.

The script keeps the site static-friendly:
- fetches RSS/search feeds from the configured source list
- filters for dog-related headlines
- writes public JSON for the page
- writes a Markdown archive for the run
- rebuilds dog-news.html
"""

from __future__ import annotations

import email.utils
import html
import json
import re
import textwrap
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "data" / "dog-headline-sources.json"
PUBLIC_JSON_PATH = ROOT / "assets" / "data" / "dog-headlines.json"
ARCHIVE_INDEX_JSON_PATH = ROOT / "assets" / "data" / "dog-headline-archive-index.json"
ARCHIVE_DIR = ROOT / "archive"
DOG_NEWS_HTML = ROOT / "dog-news.html"
DOG_NEWS_ARCHIVE_HTML = ROOT / "dog-news-archive.html"

try:
    BRISBANE_TZ = ZoneInfo("Australia/Brisbane")
except ZoneInfoNotFoundError:
    BRISBANE_TZ = timezone(timedelta(hours=10), "AEST")

CATEGORIES = [
    "Australian dog news",
    "Queensland / local council dog weirdness",
    "Dog contests, shows and trials",
    "Dog societies, breed clubs and events",
    "Working dogs and farm dogs",
    "Dog science and behaviour",
    "Dog law, parks, councils and bureaucracy",
    "NT News best headlines",
    "Dogs, aliens and odd skies",
    "Famous dogs / celebrity dogs",
    "Good Dog stories",
    "Bad Dog stories",
    "Humans being strange near dogs",
    "Absurd headlines / pun headlines / NT News-style comedy",
    "World dog news",
]

DOG_TERMS = [
    "dog", "dogs", "puppy", "puppies", "canine", "hound", "kelpie",
    "heeler", "cattle dog", "border collie", "working dog", "farm dog",
    "greyhound", "labrador", "terrier", "beagle", "poodle", "dachshund",
    "corgi", "service dog", "guide dog", "therapy dog", "rescue dog",
    "kennel", "dog show", "best in show", "breed club", "canine council",
    "crufts", "westminster kennel", "obedience trial", "agility trial",
    "flyball", "sheepdog trial", "yard dog trial",
]

SPORTS_NOISE_TERMS = [
    "western bulldogs", "bulldogs", "doggies", "afl", "aflw", "nrl",
    "freo", "fremantle", "west ham", "footballer", "premier league",
    "unleash jackson on the dogs",
]

HEAVY_TERMS = [
    "fatal", "killed", "kills", "death", "dead", "mauled", "mauling",
    "murder", "suicide", "sexual", "rape", "abuse", "torture", "cruelty",
    "poisoned", "poisoning", "child death", "baby", "infant", "dog meat",
    "distressed", "grave concerns", "neglected", "starved", "abandoned",
    "attack", "attacks", "attacked", "disappeared", "missing",
]

PUN_TERMS = [
    "bizarre", "weird", "strange", "funny", "pun", "ruff", "paws",
    "tail", "leash", "bark", "bone", "fetch", "howl",
]

FAMOUS_TERMS = [
    "famous", "celebrity", "star", "film", "movie", "screen", "royal",
    "record", "internet", "viral", "mascot", "award", "statue", "legend",
]

GOOD_DOG_TERMS = [
    "rescue", "saved", "saves", "hero", "award", "retires", "retired",
    "conservation", "festival", "favourite", "favorite", "therapy",
    "guide dog", "service dog", "community", "adoption", "support",
]

CONTEST_EVENT_TERMS = [
    "show", "contest", "competition", "championship", "trial", "agility",
    "obedience", "flyball", "sheepdog", "yard dog", "best in show",
    "crufts", "westminster", "national dog show",
]

SOCIETY_EVENT_TERMS = [
    "kennel", "breed club", "canine council", "dog society", "dogs australia",
    "dogs queensland", "american kennel club", "the kennel club",
    "fci", "event", "calendar", "member body",
]

ALIEN_SKY_TERMS = [
    "alien", "aliens", "ufo", "ufos", "uap", "extraterrestrial",
    "unidentified aerial", "unidentified anomalous", "first contact",
    "space", "nasa", "pentagon", "disclosure", "sci-fi", "science fiction",
]


def needs_dog_term(category: str) -> bool:
    lowered = category.lower()
    return not ("nt news" in lowered or "alien" in lowered or "odd skies" in lowered)


@dataclass
class Candidate:
    headline: str
    source_name: str
    source_region: str
    category: str
    date: str
    published: datetime
    link: str
    publisher_url: str
    source_feed: str
    score: int


def fetch_url(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "TwoDogsPodcastHeadlineSniff/1.0 (+https://auraofintelligence.github.io/two-dogs-podcast-backend/)",
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
        },
    )
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_text(value: str) -> str:
    text = html.unescape(value or "")
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def strip_google_suffix(title: str, source_name: str) -> str:
    title = clean_text(title)
    if " - " in title:
      parts = title.rsplit(" - ", 1)
      if len(parts) == 2 and len(parts[1]) <= 64:
          return parts[0].strip()
    return title


def parse_datetime(value: str) -> datetime | None:
    if not value:
        return None
    try:
        parsed = email.utils.parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(BRISBANE_TZ)


def date_label(value: datetime | None) -> str:
    if value is None:
        return "Date not supplied"
    return value.strftime("%Y-%m-%d")


def pretty_date(value: str) -> str:
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return value
    return parsed.strftime("%d %b %Y")


def previous_week_window(now: datetime) -> tuple[datetime, datetime]:
    """Return the previous completed Monday-Sunday window in Brisbane time."""
    current_week_start = (now - timedelta(days=now.weekday())).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )
    window_start = current_week_start - timedelta(days=7)
    window_end = current_week_start - timedelta(microseconds=1)
    return window_start, window_end


def contains_any(text: str, terms: list[str]) -> bool:
    lowered = text.lower()
    return any(term in lowered for term in terms)


def is_in_date_window(published: datetime | None, window_start: datetime, window_end: datetime) -> bool:
    if published is None:
        return False
    return window_start <= published <= window_end


def is_sports_noise(headline: str) -> bool:
    lowered = headline.lower()
    if not contains_any(lowered, SPORTS_NOISE_TERMS):
        return False
    actual_dog_terms = [
        "puppy", "canine", "hound", "kelpie", "heeler", "cattle dog",
        "working dog", "farm dog", "greyhound", "labrador", "terrier",
        "beagle", "poodle", "dachshund", "corgi", "service dog",
        "guide dog", "therapy dog", "rescue dog",
    ]
    return not contains_any(lowered, actual_dog_terms)


def category_allows(headline: str, category: str) -> bool:
    lowered = headline.lower()
    if "NT News" in category:
        return True
    if "aliens" in category or "odd skies" in category:
        return contains_any(lowered, ALIEN_SKY_TERMS)
    if "Dog contests" in category:
        return contains_any(lowered, CONTEST_EVENT_TERMS)
    if "Dog societies" in category:
        return contains_any(lowered, SOCIETY_EVENT_TERMS)
    if "Famous dogs" in category:
        return contains_any(lowered, FAMOUS_TERMS)
    if "Good Dog" in category:
        return contains_any(lowered, GOOD_DOG_TERMS)
    if "Absurd headlines" in category:
        return contains_any(lowered, DOG_TERMS)
    return True


def score_candidate(headline: str, category: str) -> int:
    lowered = headline.lower()
    score = 1
    score += sum(1 for term in DOG_TERMS if term in lowered)
    score += sum(1 for term in PUN_TERMS if term in lowered)
    if "Queensland" in category or "Australian" in category:
        score += 2
    if "NT News" in category:
        score += 3 + sum(1 for term in PUN_TERMS if term in lowered)
    if "aliens" in category.lower() or "odd skies" in category.lower():
        score += 2
    if "contests" in category.lower() or "societies" in category.lower():
        score += 2
    if "Good Dog" in category:
        score += 1
    if "Absurd" in category:
        score += 2
    if "council" in lowered or "park" in lowered or "leash" in lowered:
        score += 2
    if "study" in lowered or "research" in lowered or "science" in lowered:
        score += 2
    return score


def parse_feed(source: dict, window_start: datetime, window_end: datetime) -> tuple[list[Candidate], list[str]]:
    notes: list[str] = []
    candidates: list[Candidate] = []
    try:
        xml_text = fetch_url(source["url"])
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        notes.append(f"{source['name']}: fetch failed ({exc})")
        return candidates, notes

    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        notes.append(f"{source['name']}: RSS parse failed ({exc})")
        return candidates, notes

    for item in root.findall(".//item"):
        title = strip_google_suffix(item.findtext("title", ""), source["name"])
        link = clean_text(item.findtext("link", ""))
        published = parse_datetime(item.findtext("pubDate", ""))
        pub_date = date_label(published)
        source_node = item.find("source")
        publisher_url = source_node.attrib.get("url", "") if source_node is not None else ""
        publisher_name = clean_text(source_node.text if source_node is not None else "") or source["name"]
        haystack = f"{title} {publisher_name}"

        if not title or not link:
            continue
        if not is_in_date_window(published, window_start, window_end):
            continue
        if is_sports_noise(title):
            continue
        if needs_dog_term(source["category"]) and not contains_any(haystack, DOG_TERMS):
            continue
        if not category_allows(title, source["category"]):
            continue
        if contains_any(haystack, HEAVY_TERMS):
            notes.append(f"{source['name']}: skipped heavy/scarebait item in {source['category']}")
            continue

        candidates.append(
            Candidate(
                headline=title,
                source_name=publisher_name,
                source_region=source["region"],
                category=source["category"],
                date=pub_date,
                published=published,
                link=link,
                publisher_url=publisher_url,
                source_feed=source["name"],
                score=score_candidate(title, source["category"]),
            )
        )
    return candidates, notes


def dedupe(candidates: list[Candidate]) -> list[Candidate]:
    seen: set[str] = set()
    unique: list[Candidate] = []
    for candidate in sorted(candidates, key=lambda item: (item.score, item.published), reverse=True):
        key = re.sub(r"[^a-z0-9]+", "", candidate.headline.lower())[:90]
        if key in seen:
            continue
        seen.add(key)
        unique.append(candidate)
    return unique


def group_candidates(candidates: list[Candidate], limit: int = 6) -> dict[str, list[dict]]:
    grouped: dict[str, list[dict]] = {category: [] for category in CATEGORIES}
    for candidate in candidates:
        bucket = grouped.setdefault(candidate.category, [])
        if len(bucket) >= limit:
            continue
        bucket.append(
            {
                "headline": candidate.headline,
                "source": candidate.source_name,
                "region": candidate.source_region,
                "date": candidate.date,
                "link": candidate.link,
                "publisherUrl": candidate.publisher_url,
                "sourceFeed": candidate.source_feed,
            }
        )
    return grouped


def json_payload(
    grouped: dict[str, list[dict]],
    sources: list[dict],
    notes: list[str],
    now: datetime,
    window_start: datetime,
    window_end: datetime,
) -> dict:
    window_start_date = window_start.date().isoformat()
    window_end_date = window_end.date().isoformat()
    return {
        "lastSearched": now.isoformat(),
        "lastSearchedLabel": now.strftime("%d %b %Y, %I:%M %p AEST"),
        "weekCommencing": window_start_date,
        "searchWindowStart": window_start_date,
        "searchWindowEnd": window_end_date,
        "searchWindowLabel": f"{pretty_date(window_start_date)} to {pretty_date(window_end_date)}",
        "summary": "Headlines from the previous week.",
        "categories": CATEGORIES,
        "sourcesSearched": [
            {"name": item["name"], "category": item["category"], "region": item["region"], "url": item["url"]}
            for item in sources
        ],
        "groups": grouped,
        "notes": notes,
    }


def write_json(payload: dict) -> None:
    PUBLIC_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_JSON_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_archive(payload: dict, now: datetime) -> Path:
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    path = ARCHIVE_DIR / f"{now.date().isoformat()}-dog-headline-sniff.md"
    lines: list[str] = [
        f"# Dog Headlines - {now.date().isoformat()}",
        "",
        f"Search date/time: {payload['lastSearchedLabel']}",
        f"Articles searched from: {payload['searchWindowLabel']}",
        "",
        "## Sources searched",
        "",
    ]
    for source in payload["sourcesSearched"]:
        lines.append(f"- {source['name']} ({source['region']}) - {source['url']}")

    lines.extend(["", "## Categories and headlines", ""])
    for category in CATEGORIES:
        items = payload["groups"].get(category, [])
        if not items:
            continue
        lines.append(f"### {category}")
        lines.append("")
        for item in items:
            lines.append(f"- [{item['headline']}]({item['link']})")
            lines.append(f"  - Source: {item['source']} | Region: {item['region']} | Date: {item['date']}")
        lines.append("")

    lines.extend(["## Skipped heavy, tragedy or scarebait notes", ""])
    skip_notes = [note for note in payload["notes"] if "skipped" in note.lower()]
    if skip_notes:
        for note in skip_notes:
            lines.append(f"- {note}")
    else:
        lines.append("- No heavy/tragedy/scarebait skips recorded by the filter.")
    other_notes = [note for note in payload["notes"] if "skipped" not in note.lower()]
    if other_notes:
        lines.extend(["", "## Fetch notes", ""])
        for note in other_notes:
            lines.append(f"- {note}")
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    return path


def parse_archive_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    run_date = path.name.split("-dog-headline-sniff.md")[0]
    search_date = ""
    search_window = ""
    entries: list[dict] = []
    current_category = ""
    in_headlines = False
    last_entry: dict | None = None

    for line in lines:
        if line.startswith("Search date/time:"):
            search_date = clean_text(line.split(":", 1)[1])
            continue
        if line.startswith("Articles searched from:"):
            search_window = clean_text(line.split(":", 1)[1])
            continue
        if line == "## Categories and headlines":
            in_headlines = True
            continue
        if in_headlines and line.startswith("## "):
            in_headlines = False
            continue
        if not in_headlines:
            continue
        if line.startswith("### "):
            current_category = clean_text(line[4:])
            continue

        match = re.match(r"- \[(.+?)\]\((.+?)\)$", line)
        if match and current_category:
            last_entry = {
                "runDate": run_date,
                "archivePath": f"archive/{path.name}",
                "searchDate": search_date,
                "searchWindow": search_window,
                "category": current_category,
                "headline": clean_text(match.group(1)),
                "link": clean_text(match.group(2)),
                "source": "",
                "region": "",
                "date": "",
            }
            entries.append(last_entry)
            continue

        source_match = re.match(r"\s+- Source: (.+?) \| Region: (.+?) \| Date: (.+)$", line)
        if source_match and last_entry is not None:
            last_entry["source"] = clean_text(source_match.group(1))
            last_entry["region"] = clean_text(source_match.group(2))
            last_entry["date"] = clean_text(source_match.group(3))

    return {
        "runDate": run_date,
        "archivePath": f"archive/{path.name}",
        "searchDate": search_date,
        "searchWindow": search_window,
        "entries": entries,
    }


def build_archive_index() -> dict:
    runs = [
        parse_archive_file(path)
        for path in sorted(ARCHIVE_DIR.glob("*-dog-headline-sniff.md"), reverse=True)
    ]
    entries = [entry for run in runs for entry in run["entries"]]
    categories = sorted({entry["category"] for entry in entries})
    return {
        "generated": datetime.now(BRISBANE_TZ).isoformat(),
        "generatedLabel": datetime.now(BRISBANE_TZ).strftime("%d %b %Y, %I:%M %p AEST"),
        "runs": runs,
        "categories": categories,
        "entries": entries,
    }


def write_archive_index_json(index: dict) -> None:
    ARCHIVE_INDEX_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARCHIVE_INDEX_JSON_PATH.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def render_archive_entries(index: dict) -> str:
    cards: list[str] = []
    for entry in index["entries"]:
        haystack = " ".join(
            [
                entry["headline"],
                entry["source"],
                entry["region"],
                entry["date"],
                entry["category"],
                entry["searchWindow"],
            ]
        )
        cards.append(
            f"""
            <article class="archive-card" data-search="{escape(haystack.lower())}">
              <p class="headline-meta">{escape(entry['category'])} / {escape(entry['source'])} / {escape(entry['region'])} / Article date: {escape(entry['date'])}</p>
              <h3><a href="{escape(entry['link'])}" target="_blank" rel="noopener">{escape(entry['headline'])}</a></h3>
              <p><a href="{escape(entry['archivePath'])}">Archive run: {escape(entry['runDate'])}</a></p>
            </article>
            """
        )
    return "\n".join(cards)


def write_archive_index_html(index: dict) -> None:
    html_text = f"""<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dog News Archive | Two Dogs Podcast</title>
    <link rel="stylesheet" href="builders/styles.css" />
    <style>
      .archive-shell {{
        margin: 0 auto;
        max-width: 1320px;
        padding: 24px;
      }}

      .archive-tools {{
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: grid;
        gap: 12px;
        margin: 22px 0;
        padding: 16px;
      }}

      .archive-tools input {{
        border: 1px solid var(--line);
        border-radius: 8px;
        font: inherit;
        font-weight: 800;
        padding: 14px 16px;
        width: 100%;
      }}

      .archive-grid {{
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }}

      .archive-card {{
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: grid;
        gap: 10px;
        padding: 16px;
      }}

      .archive-card h3 {{
        font-size: 1.12rem;
        line-height: 1.18;
        margin: 0;
      }}

      .archive-card p {{
        margin: 0;
      }}

      @media (max-width: 980px) {{
        .archive-grid {{
          grid-template-columns: 1fr;
        }}
      }}
    </style>
    <link rel="icon" href="assets/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand-link" href="index.html" aria-label="Two Dogs Podcast home">
        <img class="poster-mark" src="assets/two-dogs-podcast.webp" alt="Illustrated Two Dogs Podcast poster" width="1290" height="1892" />
        <span>
          <span class="brand-kicker">Two Dogs Podcast</span>
          <strong>Dog news archive</strong>
        </span>
      </a>
      <nav class="site-nav" aria-label="Two Dogs navigation"></nav>
    </header>

    <main class="archive-shell">
      <section class="page-intro">
        <p class="kicker">Dog headlines</p>
        <h1>Archive search.</h1>
        <p class="lede">Dated headline runs and article links.</p>
      </section>

      <section class="archive-tools" aria-label="Archive search">
        <label for="archiveSearch"><strong>Search archived headlines</strong></label>
        <input id="archiveSearch" type="search" placeholder="Search headline, source, category, region or date" autocomplete="off" />
        <p><span id="archiveCount">{len(index['entries'])}</span> headlines / {len(index['runs'])} archive runs / generated {escape(index['generatedLabel'])}</p>
      </section>

      <section class="archive-grid" id="archiveGrid" aria-label="Archived headlines">
        {render_archive_entries(index)}
      </section>

      <footer data-site-flow-footer></footer>
    </main>

    <script>
      const input = document.getElementById("archiveSearch");
      const cards = Array.from(document.querySelectorAll(".archive-card"));
      const count = document.getElementById("archiveCount");
      input.addEventListener("input", () => {{
        const query = input.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {{
          const matched = !query || card.dataset.search.includes(query);
          card.hidden = !matched;
          if (matched) visible += 1;
        }});
        count.textContent = visible;
      }});
    </script>
    <script src="builders/site-nav.js"></script>
    <script src="assets/back-to-top.js"></script>
  </body>
</html>
"""
    DOG_NEWS_ARCHIVE_HTML.write_text(textwrap.dedent(html_text).strip() + "\n", encoding="utf-8")


def escape(value: str) -> str:
    return html.escape(value or "", quote=True)


def render_cards(payload: dict) -> str:
    sections: list[str] = []
    for category in CATEGORIES:
        items = payload["groups"].get(category, [])
        if not items:
            continue
        cards = []
        for item in items:
            cards.append(
                f"""
                <article class="headline-card">
                  <p class="headline-meta">{escape(item['source'])} / {escape(item['region'])} / Article date: {escape(item['date'])}</p>
                  <h3><a href="{escape(item['link'])}" target="_blank" rel="noopener">{escape(item['headline'])}</a></h3>
                </article>
                """
            )
        sections.append(
            f"""
            <section class="headline-section" id="{escape(slugify(category))}">
              <div class="section-heading">
                <p class="kicker">{escape(category)}</p>
                <h2>{escape(category)}</h2>
              </div>
              <div class="headline-grid">
                {''.join(cards)}
              </div>
            </section>
            """
        )
    return "\n".join(sections)


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def visible_categories(payload: dict) -> list[str]:
    return [category for category in CATEGORIES if payload["groups"].get(category)]


def write_html(payload: dict) -> None:
    html_text = f"""<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dog News | Two Dogs Podcast</title>
    <link rel="stylesheet" href="builders/styles.css" />
    <style>
      .news-shell {{
        margin: 0 auto;
        max-width: 1320px;
        padding: 24px;
      }}

      .news-hero {{
        align-items: center;
        display: grid;
        gap: 28px;
        grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
      }}

      .news-hero img {{
        aspect-ratio: 1536 / 1024;
        background: #101310;
        border: 1px solid rgba(23, 32, 27, 0.18);
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: block;
        height: auto;
        object-fit: contain;
        width: 100%;
      }}

      .sniff-meta {{
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        margin-top: 18px;
      }}

      .sniff-meta article,
      .headline-card {{
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 8px;
        box-shadow: var(--shadow);
        padding: 16px;
      }}

      .sniff-meta span,
      .headline-meta {{
        color: var(--red);
        font-size: 0.78rem;
        font-weight: 900;
        text-transform: uppercase;
      }}

      .sniff-meta strong {{
        display: block;
        font-size: 1.18rem;
        margin-top: 5px;
      }}

      .headline-nav {{
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 22px 0 0;
      }}

      .headline-nav a {{
        background: var(--surface-soft);
        border: 1px solid var(--line);
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 900;
        padding: 8px 10px;
        text-decoration: none;
      }}

      .headline-section {{
        margin-top: 34px;
      }}

      .headline-grid {{
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-top: 18px;
      }}

      .headline-card {{
        display: grid;
        gap: 10px;
      }}

      .headline-card h3 {{
        font-size: 1.18rem;
        line-height: 1.18;
        margin: 0;
      }}

      .headline-card a {{
        color: var(--text);
      }}

      .headline-card p {{
        color: var(--muted);
        margin: 0;
      }}

      @media (max-width: 980px) {{
        .news-hero,
        .headline-grid {{
          grid-template-columns: 1fr;
        }}
      }}

      @media (max-width: 560px) {{
        .news-shell {{
          padding: 16px 14px 32px;
        }}

        .sniff-meta {{
          grid-template-columns: 1fr;
        }}
      }}
    </style>
    <link rel="icon" href="assets/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="assets/apple-touch-icon.png" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand-link" href="index.html" aria-label="Two Dogs Podcast home">
        <img class="poster-mark" src="assets/two-dogs-podcast.webp" alt="Illustrated Two Dogs Podcast poster" width="1290" height="1892" />
        <span>
          <span class="brand-kicker">Two Dogs Podcast</span>
          <strong>Dog news</strong>
        </span>
      </a>
      <nav class="site-nav" aria-label="Two Dogs navigation"></nav>
    </header>

    <main class="news-shell">
      <section class="news-hero">
        <div>
          <p class="kicker">Dog headlines</p>
          <h1>{escape(payload['summary'])}</h1>
          <div class="hero-actions">
            <a class="button primary" href="recurring-scenes.html">Back to show rhythm</a>
            <a class="button" href="archive/{datetime.fromisoformat(payload['lastSearched']).date().isoformat()}-dog-headline-sniff.md">Open latest archive</a>
            <a class="button" href="dog-news-archive.html">Search archive</a>
            <a class="button" href="assets/data/dog-headlines.json">Open JSON</a>
          </div>
        </div>
        <img src="assets/two-dogs-robot-job-apocalypse.webp" alt="Two Dogs news-style board with robot job apocalypse panels and the two heeler hosts" width="1536" height="1024" />
      </section>

      <section class="sniff-meta" aria-label="Search metadata">
        <article><span>Last search</span><strong>{escape(payload['lastSearchedLabel'])}</strong></article>
        <article><span>Articles searched from</span><strong>{escape(payload['searchWindowLabel'])}</strong></article>
      </section>

      <nav class="headline-nav" aria-label="Headline category jump list">
        {''.join(f'<a href="#{slugify(category)}">{escape(category)}</a>' for category in visible_categories(payload))}
      </nav>

      {render_cards(payload)}

      <footer data-site-flow-footer></footer>
    </main>
    <script src="builders/site-nav.js"></script>
    <script src="assets/back-to-top.js"></script>
  </body>
</html>
"""
    DOG_NEWS_HTML.write_text(textwrap.dedent(html_text).strip() + "\n", encoding="utf-8")


def main() -> None:
    now = datetime.now(BRISBANE_TZ)
    window_start, window_end = previous_week_window(now)
    sources = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    all_candidates: list[Candidate] = []
    notes: list[str] = []

    for source in sources:
        candidates, source_notes = parse_feed(source, window_start, window_end)
        all_candidates.extend(candidates)
        notes.extend(source_notes)

    candidates = dedupe(all_candidates)
    grouped = group_candidates(candidates)
    payload = json_payload(grouped, sources, notes, now, window_start, window_end)
    write_json(payload)
    archive_path = write_archive(payload, now)
    archive_index = build_archive_index()
    write_archive_index_json(archive_index)
    write_archive_index_html(archive_index)
    write_html(payload)
    print(f"Wrote {PUBLIC_JSON_PATH.relative_to(ROOT)}")
    print(f"Wrote {archive_path.relative_to(ROOT)}")
    print(f"Wrote {ARCHIVE_INDEX_JSON_PATH.relative_to(ROOT)}")
    print(f"Wrote {DOG_NEWS_ARCHIVE_HTML.relative_to(ROOT)}")
    print(f"Wrote {DOG_NEWS_HTML.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
