import { writeFile } from "node:fs/promises";

const SOURCE_URL = "https://www.un.org/en/observances/list-days-weeks";
const OUTPUT_FILE = new URL("../assets/un-observances.js", import.meta.url);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const html = await fetch(SOURCE_URL, {
  headers: {
    "user-agent": "Two Dogs Podcast planning workbench (+https://auraofintelligence.github.io/two-dogs-podcast-backend/)"
  }
}).then((response) => {
  if (!response.ok) throw new Error(`UN observance fetch failed: ${response.status}`);
  return response.text();
});

const rows = html.split(/<div class="views-row[^"]*">/).slice(1);
const observances = rows.map(parseRow).filter(Boolean).sort((a, b) => {
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day || a.title.localeCompare(b.title);
});

if (observances.length < 200) {
  throw new Error(`Only parsed ${observances.length} observances; expected the official page to produce 200+ rows.`);
}

const generated = new Date().toISOString().slice(0, 10);
const payload = {
  sourceName: "United Nations: List of International Days and Weeks",
  sourceUrl: SOURCE_URL,
  generated,
  count: observances.length,
  observances
};

const file = `// Generated from the official United Nations observances page on ${generated}.\n// Refresh with: node tools/build-un-observances.mjs\nwindow.TWO_DOGS_UN_OBSERVANCES = ${JSON.stringify(payload, null, 2)};\n`;

await writeFile(OUTPUT_FILE, file, "utf8");
console.log(`Wrote ${observances.length} UN observances to ${OUTPUT_FILE.pathname}`);

function parseRow(row) {
  const title = row.match(/views-field-title[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>/);
  const date = row.match(/content="([0-9T:+-]+)"[^>]*class="date-display-single">([\s\S]*?)<\/span>/);
  if (!title || !date) return null;

  const resolution = row.match(/views-field-field-url[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>/);
  const iso = date[1];
  const month = Number(iso.slice(5, 7));
  const day = Number(iso.slice(8, 10));

  return {
    month,
    monthName: months[month - 1],
    day,
    dateLabel: clean(date[2]),
    title: clean(title[2]),
    url: absoluteUrl(title[1]),
    resolution: resolution ? clean(resolution[2]) : "",
    resolutionUrl: resolution ? absoluteUrl(resolution[1]) : ""
  };
}

function clean(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function absoluteUrl(value) {
  return new URL(value, SOURCE_URL).href;
}
