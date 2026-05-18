const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedDate = "2026-05-18";
const episodeDir = path.join(root, "episodes");
const sceneDir = path.join(root, "scenes");
const adDir = path.join(root, "ads-sponsors");
const segmentDir = path.join(root, "segments");
const sourceDir = path.join(root, "source-references");

const narrativeOrder = [
  "episode-2026-05-17-strange-enough-true-enough.md",
  "episode-2026-05-17-film-club-yarn-to-scene.md",
  "episode-2026-05-17-local-thread-not-straight-line.md",
  "episode-2026-05-17-shared-table-practical-generosity.md",
  "episode-2026-05-17-health-and-culture-community-engine.md",
  "episode-2026-05-17-hyperlocal-media-local-story.md",
  "episode-2026-05-17-projector-in-the-wind.md",
  "episode-2026-05-17-bigger-local-picture-archipelago.md",
  "episode-2026-05-18-housing-simulations-many-solutions.md",
  "episode-2026-05-17-profile-md-aura-md-boundaries.md",
  "episode-2026-05-17-legal-memory-facts-before-ai.md",
  "episode-2026-05-17-public-ledger-game-without-hype.md",
  "episode-2026-05-17-p4a-joyful-responsible-abundance.md",
  "episode-2026-05-18-grey-area-commons-intimacy.md",
  "episode-2026-05-17-mineral-moonshots-ancient-sands-future-stories.md",
  "episode-2026-05-17-gajra-earth-plain-language.md",
  "episode-2026-05-17-disaster-kiosks-when-internet-fails.md",
  "episode-2026-05-17-good-idea-to-fundable.md",
  "episode-2026-05-17-honour-board-without-ego.md",
  "episode-2026-05-17-music-archive-as-memory.md",
  "episode-2026-05-17-ai-native-indie-distribution.md"
];

const sharedBoundary = [
  "- Luke is Red Dog / Red Heeler.",
  "- Angel is Blue Dog / Blue Heeler.",
  "- Blue Dog material is Angel-directed only.",
  "- Guests choose their own spirit animal character and nickname.",
  "- These are discussion drafts, not complete episode plans."
].join("\n");

for (const dir of [sceneDir, adDir, segmentDir, sourceDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const episodeFiles = fs
  .readdirSync(episodeDir)
  .filter((file) => /^episode-\d{4}-\d{2}-\d{2}-.+\.md$/.test(file))
  .sort(compareEpisodeFiles);

const drafts = episodeFiles.map((file, index) => {
  const sourcePath = path.join(episodeDir, file);
  const parsed = parseEpisode(file, fs.readFileSync(sourcePath, "utf8"), index);
  return buildDraftSet(parsed, index, episodeFiles.length);
});

for (const draft of drafts) {
  writeFile(path.join(sceneDir, draft.scene.file), draft.scene.markdown);
  writeFile(path.join(adDir, draft.ad.file), draft.ad.markdown);
  writeFile(path.join(segmentDir, draft.segment.file), draft.segment.markdown);
  writeFile(path.join(sourceDir, draft.source.file), draft.source.markdown);
  writeFile(path.join(episodeDir, draft.page.file), draft.page.html);
}

writeFile(path.join(episodeDir, "index.html"), buildEpisodeIndex(drafts));
writeFile(path.join(episodeDir, "styles.css"), buildEpisodeStyles());

console.log(`Generated ${drafts.length} episode pages and ${drafts.length * 4} companion Markdown drafts.`);

function parseEpisode(file, markdown, index) {
  const normal = markdown.replace(/\r\n/g, "\n");
  const title = (normal.match(/^# Episode - (.+)$/m) || [null, stripExt(file)])[1].trim();
  const sections = {};
  const lines = normal.split("\n");
  let current = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)\s*$/);
    if (match) {
      current = match[1].trim();
      sections[current] = [];
      continue;
    }
    if (current) sections[current].push(line);
  }

  const section = (name) => clean((sections[name] || []).join("\n"));
  const mainBeats = listItems(section("Main Beats"));
  const sceneSeeds = listItems(section("Scene Seeds"));
  const segmentSeeds = listItems(section("Segment Seeds"));
  const adIdeas = listItems(section("Ad Or Sponsor Possibilities"));
  const sourceRefs = listItems(section("Source References"));
  const shape = listItems(section("45-Minute Shape"));
  const toneBoundary = listItems(section("Tone Boundary"));

  return {
    index,
    file,
    base: stripExt(file),
    title,
    shortTitle: title.split(":")[0].trim(),
    slug: slugify(title),
    hook: section("Hook"),
    why: section("Why This Episode"),
    redDog: section("Red Dog Angle"),
    nextAction: section("Next Useful Action"),
    mainBeats,
    sceneSeeds,
    segmentSeeds,
    adIdeas,
    sourceRefs,
    shape,
    toneBoundary
  };
}

function buildDraftSet(episode, index, total) {
  const slug = trimSlug(episode.slug);
  const sceneFile = `scene-${generatedDate}-${slug}.md`;
  const adFile = `ad-sponsor-${generatedDate}-${slug}.md`;
  const segmentFile = `segment-${generatedDate}-${slug}.md`;
  const sourceFile = `source-${generatedDate}-${slug}.md`;
  const pageFile = `${episode.base}.html`;
  const previous = index > 0 ? `${draftPageName(episodeFiles[index - 1])}` : "index.html";
  const next = index < total - 1 ? `${draftPageName(episodeFiles[index + 1])}` : "index.html";

  const firstScene = episode.sceneSeeds[0] || `Two dogs at the beach microphone while "${episode.shortTitle}" appears as simple labels in the sand.`;
  const firstSegment = episode.segmentSeeds[0] || `${episode.shortTitle} Field Check`;
  const firstBeat = episode.mainBeats[0] || firstSentence(episode.hook) || `Red Dog introduces ${episode.shortTitle} in plain language.`;
  const sourceTrail = [
    `Episode seed: ../episodes/${episode.file}`,
    ...episode.sourceRefs
  ].join("\n");

  const scene = {
    file: sceneFile,
    title: `${episode.shortTitle}: First Visual Beat`,
    visualBeat: firstScene,
    conversationBeat: [
      firstSentence(episode.hook),
      "The scene should land the episode question quickly, then leave room for the conversation to open naturally."
    ].filter(Boolean).join("\n\n"),
    redDogBeat: clean(episode.redDog) || `Red Dog makes ${episode.shortTitle} feel practical, funny and watchable instead of abstract.`,
    animationNotes: [
      "Keep Blue Dog visually present but do not script Angel's voice.",
      "Use the Two Dogs beach/poster world as the visual anchor.",
      "Let props, labels and background signs carry the more abstract idea.",
      "Make the first image clear enough to work as a short clip thumbnail."
    ],
    soundNotes: [
      "Waves, relaxed microphone presence and small island ambience.",
      "Use a short theme-song sting if it fits the cut.",
      "Leave timing space for Angel-directed Blue Dog reactions later."
    ],
    sourceTrail,
    nextAction: `Discuss whether this is a 20-40 second opener, a later scene, or only a visual note before expanding the ${episode.shortTitle} episode.`
  };

  scene.markdown = sceneMarkdown(episode, scene);

  const ad = {
    file: adFile,
    title: adTitleFor(episode),
    fit: [
      `This works as an in-world sponsor or mock sponsor because ${episode.shortTitle} needs a light practical break before the bigger idea gets too dense.`,
      episode.adIdeas.length ? `Seed idea from the episode: ${episode.adIdeas[0]}` : "Use it as a playful ad read, not a real sponsor claim, until a real supporter or sponsor exists."
    ].join("\n\n"),
    offer: `A short, clearly labelled Two Dogs ad slot that offers one useful habit, tool or local support idea connected to ${episode.shortTitle}.`,
    redDogRead: buildAdRead(episode),
    scenePossibility: `Cut to Red Dog demonstrating the offer as a beach-table prop gag, then return to the main yarn before it feels like a commercial break.`,
    boundaries: [
      "Mark mock sponsor material clearly until there is a real sponsor.",
      "Do not imply medical, legal, financial or safety outcomes unless a qualified source supports the claim.",
      "Do not write Blue Dog copy unless Angel supplies it.",
      "Keep the ad useful, cheeky and short."
    ].join("\n"),
    nextAction: `Discuss a 15-second Red Dog-only test read and decide whether it belongs inside the episode, as a separate clip, or nowhere yet.`
  };

  ad.markdown = adMarkdown(episode, ad);

  const segment = {
    file: segmentFile,
    name: firstSegment,
    purpose: `Give the ${episode.shortTitle} episode a repeatable piece that can stand alone as a clip while still feeding the larger 45-minute yarn.`,
    format: [
      "Red Dog names the question in one sentence.",
      "One concrete example is pulled from the episode seed.",
      "The hosts test whether the idea is useful, funny, risky, or still too muddy.",
      "Blue Dog timing and voice remain blank for Angel to direct.",
      "Close with one practical question for the listener, guest or future scene pass."
    ],
    redDogRole: clean(episode.redDog) || `Red Dog keeps ${episode.shortTitle} grounded in plain language and local usefulness.`,
    guestRole: "Only include guest animal, nickname or lived examples after the guest chooses and consents to them.",
    exampleUses: [
      firstBeat,
      ...episode.mainBeats.slice(1, 4),
      ...episode.segmentSeeds.slice(1, 3).map((item) => `Can spin into: ${item}`)
    ],
    sourceRefs: [
      `Episode seed: ../episodes/${episode.file}`,
      ...episode.sourceRefs
    ]
  };

  segment.markdown = segmentMarkdown(episode, segment);

  const source = {
    file: sourceFile,
    title: `${episode.shortTitle} source trail`,
    path: sourceTrail,
    visibility: sourceVisibility(episode),
    why: `This source trail keeps the ${episode.shortTitle} episode connected to its originating Strange But True, Aura, local, or public-planning context without flooding the episode with every deeper document.`,
    usefulFor: [
      "Luke and Angel discussion",
      "Red Dog research prep",
      "Scene and ad/sponsor checks",
      "Segment framing",
      "Future public/private review before publishing clips"
    ],
    takeaway: plainTakeaway(episode),
    notOverclaim: `Do not present ${episode.shortTitle} as a complete plan, finished policy, expert finding or public promise. Treat it as a first-draft discussion seed until Luke and Angel review it.`,
    deeperReading: deeperReading(episode)
  };

  source.markdown = sourceMarkdown(source);

  return {
    episode,
    scene,
    ad,
    segment,
    source,
    page: {
      file: pageFile,
      html: episodePageHtml({ episode, scene, ad, segment, source, previous, next, index, total })
    }
  };
}

function sceneMarkdown(episode, scene) {
  return doc([
    heading("Scene", scene.title),
    meta(),
    section("Linked Episode", `../episodes/${episode.file}`),
    section("Discussion Status", discussionStatus()),
    listSection("Luke And Angel Discussion Prompts", discussionPrompts(episode)),
    section("Core Boundaries", sharedBoundary),
    section("Visual Beat", scene.visualBeat),
    section("Conversation Beat", scene.conversationBeat),
    section("Red Dog Beat", scene.redDogBeat),
    section("Blue Dog Boundary", "[Blue Dog space - Angel to direct]"),
    section("Guest Character", "Only fill this in after the guest has chosen their own animal and nickname."),
    listSection("Animation Notes", scene.animationNotes),
    listSection("Sound Or Music Notes", scene.soundNotes),
    listSection("Source Trail", scene.sourceTrail),
    section("Next Useful Action", scene.nextAction)
  ]);
}

function adMarkdown(episode, ad) {
  return doc([
    heading("Ad Or Sponsor Idea", ad.title),
    meta(),
    section("Episode Link", `../episodes/${episode.file}`),
    section("Discussion Status", discussionStatus()),
    listSection("Luke And Angel Discussion Prompts", discussionPrompts(episode)),
    section("Fit", ad.fit),
    section("Plain-English Offer", ad.offer),
    section("Red Dog Read", ad.redDogRead),
    section("Blue Dog Boundary", "[Blue Dog space - Angel to direct]"),
    section("Scene Possibility", ad.scenePossibility),
    section("Boundaries", ad.boundaries),
    section("Next Useful Action", ad.nextAction)
  ]);
}

function segmentMarkdown(episode, segment) {
  return doc([
    heading("Segment Idea", segment.name),
    meta(),
    section("Discussion Status", discussionStatus()),
    listSection("Luke And Angel Discussion Prompts", discussionPrompts(episode)),
    section("Purpose", segment.purpose),
    listSection("Format", segment.format),
    section("Red Dog Role", segment.redDogRole),
    section("Blue Dog Boundary", "[Blue Dog space - Angel to direct]"),
    section("Guest Role", segment.guestRole),
    listSection("Example Uses", segment.exampleUses),
    listSection("Source References", segment.sourceRefs)
  ]);
}

function sourceMarkdown(source) {
  return doc([
    heading("Source Reference", source.title),
    meta(),
    section("Discussion Status", discussionStatus()),
    section("Source", source.path),
    section("Visibility", source.visibility),
    section("Why It Matters", source.why),
    listSection("Useful For", source.usefulFor),
    section("Plain-English Takeaway", source.takeaway),
    section("What Not To Overclaim", source.notOverclaim),
    section("Deeper Reading Needed", source.deeperReading)
  ]);
}

function episodePageHtml(data) {
  const { episode, scene, ad, segment, source, previous, next, index, total } = data;
  return `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(episode.shortTitle)} | Two Dogs Discussion Draft</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand-link" href="../index.html">
        <img src="../assets/two-dogs-podcast.webp" alt="Two Dogs Podcast artwork" width="1290" height="1892" />
        <span><strong>Two Dogs Podcast</strong><small>First draft discussion pages</small></span>
      </a>
      <nav aria-label="Episode pages">
        <a href="../index.html">Home</a>
        <a href="index.html">All episodes</a>
        <a href="../recurring-scenes.html">Recurring</a>
        <a href="../builders/index.html">Builders</a>
        <a href="https://auraofintelligence.github.io/strange-but-true/film-club-world.html">Film Club</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <p class="draft-badge">First draft discussion</p>
        <p class="eyebrow">Episode ${String(index + 1).padStart(2, "0")} of ${String(total).padStart(2, "0")}</p>
        <h1>${escapeHtml(episode.title)}</h1>
        <p class="lede">${escapeHtml(firstParagraph(episode.hook))}</p>
        <p class="draft-note">For Luke and Angel to discuss. This is not a complete episode plan, script, sponsor pack, or production decision.</p>
        <div class="quick-links" aria-label="Draft file links">
          <a href="${escapeAttr(episode.file)}">Episode .md</a>
          <a href="../scenes/${escapeAttr(scene.file)}">Scene .md</a>
          <a href="../ads-sponsors/${escapeAttr(ad.file)}">Ad/Sponsor .md</a>
          <a href="../segments/${escapeAttr(segment.file)}">Segment .md</a>
          <a href="../source-references/${escapeAttr(source.file)}">Source .md</a>
        </div>
      </section>

      <section class="discussion-panel" aria-label="Discussion prompts">
        <h2>Discussion table</h2>
        <p>Use this page as a shared talking surface. Keep what has energy, demote anything too small into a segment, and leave Angel's Blue Dog voice open for Angel.</p>
        <div class="discussion-grid">
          ${discussionItem("Luke / Red Dog", "What is the plain-language doorway, and where should the deeper Strange But True, Aura or P4A material enter without taking over?")}
          ${discussionItem("Angel / Blue Dog", "Space for Angel to respond, redirect, add timing, or reject the bit. No Blue Dog lines are written here.")}
          ${discussionItem("Episode or segment?", "Decide whether this deserves a full 45-minute yarn, belongs inside another episode, or should stay as a recurring short segment.")}
          ${discussionItem("Before recording", "Check the source boundary, guest boundary, mock-sponsor status, and the one practical question the audience should be left with.")}
        </div>
      </section>

      <section class="draft-grid" aria-label="Episode discussion draft package">
        ${draftCard("Episode Seed", [
          ["Why this episode", episode.why],
          ["Red Dog angle", episode.redDog],
          ["Main beats", bulletHtml(episode.mainBeats)],
          ["Next action", episode.nextAction]
        ])}
        ${draftCard("Scene Draft", [
          ["Scene title", scene.title],
          ["Visual beat", scene.visualBeat],
          ["Conversation beat", scene.conversationBeat],
          ["Animation notes", bulletHtml(scene.animationNotes)],
          ["Sound notes", bulletHtml(scene.soundNotes)]
        ])}
        ${draftCard("Segment Draft", [
          ["Segment name", segment.name],
          ["Purpose", segment.purpose],
          ["Format", bulletHtml(segment.format)],
          ["Red Dog role", segment.redDogRole],
          ["Guest boundary", segment.guestRole]
        ])}
        ${draftCard("Ad/Sponsor Draft", [
          ["Idea", ad.title],
          ["Fit", ad.fit],
          ["Offer", ad.offer],
          ["Red Dog read", ad.redDogRead],
          ["Boundaries", paragraphToHtml(ad.boundaries)]
        ])}
        ${draftCard("Source Draft", [
          ["Visibility", source.visibility],
          ["Why it matters", source.why],
          ["Useful for", bulletHtml(source.usefulFor)],
          ["Plain-English takeaway", source.takeaway],
          ["Do not overclaim", source.notOverclaim]
        ])}
      </section>

      <nav class="pager" aria-label="Previous and next episode pages">
        <a href="${escapeAttr(previous)}"><span>Previous</span><strong>${previous === "index.html" ? "Episode Index" : "Previous Episode"}</strong></a>
        <a href="${escapeAttr(next)}"><span>Next</span><strong>${next === "index.html" ? "Episode Index" : "Next Episode"}</strong></a>
      </nav>
    </main>
    <script src="../assets/back-to-top.js"></script>
  </body>
</html>
`;
}

function buildEpisodeIndex(drafts) {
  const cards = drafts.map((draft, index) => {
    const { episode, page, scene, ad, segment, source } = draft;
    return `<article class="episode-card">
      <p class="draft-badge">First draft discussion</p>
      <p class="eyebrow">Episode ${String(index + 1).padStart(2, "0")}</p>
      <h2><a href="${escapeAttr(page.file)}">${escapeHtml(episode.title)}</a></h2>
      <p>${escapeHtml(firstParagraph(episode.hook))}</p>
      <p class="card-note">Open this as a Luke and Angel discussion page, not a finished episode plan.</p>
      <div class="file-row">
        <a href="${escapeAttr(episode.file)}">Episode</a>
        <a href="../scenes/${escapeAttr(scene.file)}">Scene</a>
        <a href="../ads-sponsors/${escapeAttr(ad.file)}">Ad</a>
        <a href="../segments/${escapeAttr(segment.file)}">Segment</a>
        <a href="../source-references/${escapeAttr(source.file)}">Source</a>
      </div>
    </article>`;
  }).join("\n");

  return `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Two Dogs Episode Discussion Drafts</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand-link" href="../index.html">
        <img src="../assets/two-dogs-podcast.webp" alt="Two Dogs Podcast artwork" width="1290" height="1892" />
        <span><strong>Two Dogs Podcast</strong><small>First draft discussion pages</small></span>
      </a>
      <nav aria-label="Episode pages">
        <a href="../index.html">Home</a>
        <a href="../recurring-scenes.html">Recurring</a>
        <a href="../builders/index.html">Builders</a>
        <a href="../builders/episode.html">Episode builder</a>
        <a href="https://auraofintelligence.github.io/strange-but-true/film-club-world.html">Film Club</a>
      </nav>
    </header>

    <main>
      <section class="hero index-hero">
        <div>
          <p class="draft-badge">First draft discussion index</p>
          <h1>Two Dogs episode discussion drafts.</h1>
          <p class="lede">Each page gathers the episode seed plus scene, ad/sponsor, segment and source-reference drafts so Luke and Angel can talk through what belongs in a full episode, what is only a segment, and what should stay parked. Guest and handoff forms are intentionally skipped for this pass.</p>
          <p class="draft-note">Nothing here is complete or locked. These are working pages for conversation before recording, sourcing, guests, or production decisions.</p>
        </div>
        <img class="draft-style-board" src="../assets/two-dogs-draft-styles.webp" alt="Draft style board showing four possible animated looks for Red Heeler and Blue Heeler hosts" width="1254" height="1254" />
      </section>
      <section class="episode-grid" aria-label="Episode discussion drafts">
        ${cards}
      </section>
    </main>
    <script src="../assets/back-to-top.js"></script>
  </body>
</html>
`;
}

function buildEpisodeStyles() {
  return `:root {
  color-scheme: light;
  --bg: #f4f6f3;
  --surface: #ffffff;
  --surface-soft: #edf4f2;
  --text: #17201b;
  --muted: #59645f;
  --line: #d8dfdc;
  --red: #b54030;
  --blue: #2265a8;
  --green: #2f6b4f;
  --gold: #b9852c;
  --shadow: 0 18px 45px rgba(23, 32, 27, 0.1);
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.55;
  margin: 0;
}

a {
  color: inherit;
}

.site-header {
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 18px;
  justify-content: space-between;
  padding: 14px 24px;
  position: sticky;
  top: 0;
  z-index: 2;
}

.brand-link {
  align-items: center;
  display: flex;
  gap: 12px;
  text-decoration: none;
}

.brand-link img {
  border: 1px solid rgba(23, 32, 27, 0.18);
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(23, 32, 27, 0.16);
  height: 72px;
  object-fit: cover;
  object-position: 50% 18%;
  width: 49px;
}

.brand-link strong,
.brand-link small {
  display: block;
}

.brand-link small,
.eyebrow {
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 800;
}

.site-header nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.site-header nav a,
.quick-links a,
.file-row a,
.pager a {
  border: 1px solid var(--line);
  border-radius: 6px;
  font-weight: 800;
  text-decoration: none;
}

.site-header nav a {
  background: #ffffff;
  padding: 8px 10px;
}

main {
  margin: 0 auto;
  max-width: 1180px;
  padding: 28px 20px 44px;
}

.hero {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: clamp(18px, 4vw, 34px);
}

.index-hero {
  align-items: center;
  display: grid;
  gap: 22px;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
  margin-bottom: 22px;
}

.draft-style-board {
  aspect-ratio: 1 / 1;
  background: #101310;
  border: 1px solid rgba(23, 32, 27, 0.18);
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(23, 32, 27, 0.16);
  display: block;
  height: auto;
  object-fit: contain;
  width: 100%;
}

.draft-badge {
  background: var(--red);
  border-radius: 6px;
  color: #ffffff;
  display: inline-flex;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  margin: 0 0 10px;
  padding: 6px 9px;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  letter-spacing: 0;
  line-height: 1.08;
  margin: 0;
}

h1 {
  font-size: clamp(2rem, 6vw, 4.8rem);
  max-width: 980px;
}

h2 {
  font-size: clamp(1.35rem, 2.4vw, 2rem);
}

h3 {
  font-size: 1rem;
}

.lede {
  color: var(--muted);
  font-size: clamp(1rem, 2vw, 1.22rem);
  max-width: 900px;
}

.draft-note,
.card-note {
  color: var(--muted);
  font-weight: 700;
}

.draft-note {
  max-width: 880px;
}

.quick-links,
.file-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-links {
  margin-top: 18px;
}

.quick-links a,
.file-row a {
  background: var(--surface-soft);
  padding: 8px 10px;
}

.discussion-panel {
  background: #eaf2ef;
  border: 1px solid var(--line);
  border-left: 6px solid var(--blue);
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 18px;
  padding: 18px;
}

.discussion-panel > p {
  color: var(--muted);
  font-weight: 700;
  margin: 10px 0 0;
  max-width: 900px;
}

.discussion-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 16px;
}

.discussion-item {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(23, 32, 27, 0.1);
  border-radius: 8px;
  padding: 14px;
}

.discussion-item p {
  color: var(--muted);
  margin: 8px 0 0;
}

.draft-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.draft-card,
.episode-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
  min-width: 0;
  padding: 18px;
}

.draft-card:first-child {
  grid-column: 1 / -1;
}

.draft-section {
  border-top: 1px solid var(--line);
  margin-top: 14px;
  padding-top: 12px;
}

.draft-section:first-of-type {
  border-top: 0;
}

.draft-section p {
  margin: 8px 0 0;
}

ul {
  margin-bottom: 0;
  padding-left: 1.1rem;
}

.episode-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.episode-card {
  display: grid;
  gap: 10px;
}

.episode-card p {
  margin: 0;
}

.pager {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 18px;
}

.pager a {
  background: var(--surface);
  box-shadow: var(--shadow);
  display: grid;
  padding: 16px;
}

.pager a:last-child {
  text-align: right;
}

.pager span {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 900;
}

.back-to-top {
  background: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  bottom: calc(22px + env(safe-area-inset-bottom));
  box-shadow: var(--shadow);
  color: #ffffff;
  cursor: pointer;
  font-weight: 900;
  min-height: 48px;
  opacity: 0;
  padding: 0 16px;
  pointer-events: none;
  position: fixed;
  right: 18px;
  transform: translateY(10px);
  transition: opacity 160ms ease, transform 160ms ease;
  z-index: 80;
}

.back-to-top.is-visible {
  opacity: 0.94;
  pointer-events: auto;
  transform: translateY(0);
}

.back-to-top:hover {
  background: var(--red);
}

@media (max-width: 900px) {
  .site-header {
    align-items: stretch;
    display: grid;
  }

  .site-header nav {
    justify-content: stretch;
  }

  .site-header nav a {
    flex: 1 1 auto;
    text-align: center;
  }

  .draft-grid,
  .discussion-grid,
  .episode-grid,
  .index-hero,
  .pager {
    grid-template-columns: 1fr;
  }

  .draft-style-board {
    max-width: 520px;
    order: -1;
  }

  .draft-card:first-child {
    grid-column: auto;
  }

  .pager a:last-child {
    text-align: left;
  }
}

@media (max-width: 560px) {
  .site-header {
    padding: 10px 14px;
  }

  main {
    padding: 16px 14px 34px;
  }

  .brand-link img {
    height: 92px;
    width: 63px;
  }

  .back-to-top {
    bottom: calc(88px + env(safe-area-inset-bottom));
    right: 14px;
  }
}
`;
}

function draftCard(title, rows) {
  const body = rows
    .filter(([, value]) => clean(value))
    .map(([label, value]) => `<section class="draft-section"><h3>${escapeHtml(label)}</h3>${htmlValue(value)}</section>`)
    .join("\n");
  return `<article class="draft-card"><h2>${escapeHtml(title)}</h2>${body}</article>`;
}

function discussionItem(title, text) {
  return `<section class="discussion-item"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></section>`;
}

function htmlValue(value) {
  const text = String(value || "");
  if (text.trim().startsWith("<")) return text;
  return paragraphToHtml(text);
}

function paragraphToHtml(value) {
  return clean(value)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function bulletHtml(items) {
  const values = Array.isArray(items) ? items : listItems(items);
  if (!values.length) return "";
  return `<ul>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function discussionStatus() {
  return "First draft for Luke and Angel to discuss. Not complete, not locked, and not a Blue Dog script.";
}

function discussionPrompts(episode) {
  return [
    `Should "${episode.shortTitle}" be a full episode, a scene inside another episode, or a recurring segment?`,
    "What should Luke / Red Dog make plainer before recording?",
    "What should stay blank for Angel / Blue Dog to direct?",
    "What source, guest, sponsor or privacy boundary needs checking before this goes public?"
  ];
}

function adTitleFor(episode) {
  if (episode.adIdeas.length) {
    const first = episode.adIdeas[0].replace(/^A mock sponsor read for\s+/i, "").replace(/^A fake sponsor read for\s+/i, "");
    return first.replace(/[.:]+$/, "").trim();
  }
  return `The Decent Yarn Test - ${episode.shortTitle}`;
}

function buildAdRead(episode) {
  if (/grey-area/i.test(episode.title)) {
    return "Red Dog: This bit is brought to you by Boundary Sunscreen. Apply before entering emotionally ambiguous conditions. Reapply after mixed signals, long voice notes, or any sentence that starts with 'so what are we?'.";
  }

  return [
    `Red Dog: This bit is brought to you by The Decent Yarn Test for ${episode.shortTitle}.`,
    "If the idea cannot survive one plain-language explanation, one useful example, and one laugh at itself, it goes back in the esky until it behaves.",
    "Not a real sponsor yet - just a reminder to keep the yarn useful."
  ].join("\n\n");
}

function sourceVisibility(episode) {
  const all = [episode.hook, episode.why, episode.redDog, ...episode.sourceRefs].join(" ").toLowerCase();
  if (all.includes("private") || all.includes("local source") || all.includes("aura navigator") || all.includes("../")) {
    return "mixed";
  }
  if (all.includes("public page") || all.includes("public site")) return "public";
  return "mixed";
}

function plainTakeaway(episode) {
  const hook = firstSentence(episode.hook);
  if (hook) return hook;
  if (episode.mainBeats.length) return episode.mainBeats[0];
  return `${episode.shortTitle} is a first-draft Two Dogs planning topic that needs scene, segment and source review before production.`;
}

function deeperReading(episode) {
  if (!episode.sourceRefs.length) {
    return "No deeper source has been selected yet. Start with the episode seed and source-routing notes before opening any large archive.";
  }

  return [
    "Review only the sources named above before production.",
    "If a deeper private or local archive is needed, use the source-routing notes first and keep private material out of public pages."
  ].join("\n");
}

function heading(type, title) {
  return `# ${type}${title ? ` - ${title}` : ""}`;
}

function meta() {
  return [
    "Status: first draft",
    `Generated: ${generatedDate}`,
    "Generated by Two Dogs interactive feedback form."
  ].join("\n");
}

function section(title, value) {
  if (!clean(value)) return "";
  return `## ${title}\n\n${clean(value)}`;
}

function listSection(title, value) {
  const items = Array.isArray(value) ? value : listItems(value);
  if (!items.length) return "";
  return `## ${title}\n\n${items.map((item) => `- ${item.replace(/^-+\s*/, "")}`).join("\n")}`;
}

function doc(parts) {
  return `${parts.filter(Boolean).join("\n\n").trim()}\n`;
}

function clean(value) {
  return String(value || "").trim();
}

function listItems(value) {
  return clean(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-+\s*/, ""));
}

function compareEpisodeFiles(a, b) {
  const aIndex = narrativeOrder.indexOf(a);
  const bIndex = narrativeOrder.indexOf(b);
  if (aIndex !== -1 || bIndex !== -1) {
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  }
  return a.localeCompare(b);
}

function firstParagraph(value) {
  return clean(value).split(/\n{2,}/).find(Boolean) || "";
}

function firstSentence(value) {
  const paragraph = firstParagraph(value);
  const match = paragraph.match(/^(.+?[.!?])(\s|$)/);
  return match ? match[1] : paragraph;
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\.md/g, " md ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function trimSlug(slug) {
  return slug.slice(0, 90).replace(/-+$/g, "") || "draft";
}

function stripExt(file) {
  return file.replace(/\.md$/i, "");
}

function draftPageName(file) {
  return `${stripExt(file)}.html`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function writeFile(file, content) {
  fs.writeFileSync(file, content, "utf8");
}
