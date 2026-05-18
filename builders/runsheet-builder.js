const STORE_KEY = "two-dogs-runsheet-builder-v1";

const coreBoundary = [
  "- Angel is Blue Dog / Blue Heeler.",
  "- Blue Dog material is Angel-directed only.",
  "- Luke is Red Dog / Red Heeler.",
  "- Guests choose their own spirit animal character and nickname.",
  "- Current events, weather, sports and public claims need fresh source checks on recording day.",
  "- This is a showrunner working page, not a locked script."
].join("\n");

const components = [
  component("opening-theme", "Opening Theme", "Opening", 2, "Theme sting, beach sound, title card and the first line into the show."),
  component("host-check-in", "Host Check-In", "Opening", 3, "Angel controls Blue Dog space; Red Dog can frame the day without over-explaining."),
  component("lead-story-hook", "Lead Story Hook", "Story", 5, "The first useful question, image or problem that makes the main story worth hearing."),
  component("main-yarn", "Main Story Yarn", "Story", 14, "The heart of the episode: story, guest, debate, local example or Strange But True doorway."),
  component("source-check", "Source Check Pause", "Evidence", 3, "A short on-air honesty break: what is known, what is not, and what needs checking."),
  component("guest-onboarding", "Guest / Animal Reveal", "Guest", 4, "Invitee intro, consent boundaries, and guest-chosen spirit animal and nickname."),
  component("ad-break-one", "Ad / Sponsor Break", "Ad", 2, "A short native sponsor read, mock sponsor, support note or merch doorway."),
  component("news-flash", "News Flash", "Recurring", 3, "One current item with date, source posture and why it matters today."),
  component("good-dog", "Good Dog", "Recurring", 3, "Good news, achievement or community win worth saluting."),
  component("bad-dog", "Bad Dog", "Recurring", 3, "Bad choices, corruption risk, accidents or avoidable failures, handled carefully."),
  component("weather-window", "Weather Window", "Recurring", 2, "Weather, tides, ferry mood or outdoor conditions as a scene bridge."),
  component("music-drop", "Music Drop", "Culture", 3, "Theme-song cue, local track, soundtrack idea or music-memory bridge."),
  component("film-art-games", "Film / Art / Games Table", "Culture", 4, "What would this look like as a scene, game, poster, screening or art moment?"),
  component("micro-scene-pack", "Micro Scene Pack", "Scene", 2, "Quick cutaways: gate, walk, postie, research jump, can crack, stick, ferry watch."),
  component("walk-and-talk", "Walk And Talk Reset", "Scene", 3, "Take the conversation outside when it needs movement, air or a lighter bridge."),
  component("freestyle-segue-bank", "Freestyle Segue Bank", "Freestyle", 5, "Prepared transitions for a loose episode: if the yarn wanders, use these doorways."),
  component("audience-onboarding", "Audience / Ally Doorway", "Meta", 2, "How listeners, guests, helpers or allies can understand the show without a lecture."),
  component("closing-round", "Closing Round", "Closing", 4, "What did we learn, what stays open, who needs thanks, and what comes next?"),
  component("outro-theme", "Outro / Theme Button", "Closing", 1, "Final line, sound cue, theme reprise, waves, laughter or dog howl.")
];

const coreSet = [
  "opening-theme",
  "host-check-in",
  "lead-story-hook",
  "main-yarn",
  "source-check",
  "micro-scene-pack",
  "ad-break-one",
  "closing-round",
  "outro-theme"
];

const freestyleSet = [
  "opening-theme",
  "host-check-in",
  "freestyle-segue-bank",
  "micro-scene-pack",
  "walk-and-talk",
  "good-dog",
  "music-drop",
  "audience-onboarding",
  "closing-round",
  "outro-theme"
];

let state = loadState();

const componentList = document.getElementById("componentList");
const form = document.getElementById("runsheetForm");
const markdown = document.getElementById("runsheetMarkdown");
const filename = document.getElementById("runsheetFilename");
const statusLine = document.getElementById("runsheetStatus");
const preview = document.getElementById("runsheetPreview");

document.getElementById("selectCore").addEventListener("click", () => applyPreset(coreSet, "structured experiment"));
document.getElementById("selectFreestyle").addEventListener("click", () => applyPreset(freestyleSet, "freestyle with prepared segues"));
document.getElementById("selectAll").addEventListener("click", () => setSelected(components.map((item) => item.id)));
document.getElementById("clearComponents").addEventListener("click", () => setSelected([]));
document.getElementById("downloadRunsheet").addEventListener("click", downloadMarkdown);
document.getElementById("copyRunsheet").addEventListener("click", copyMarkdown);
document.getElementById("resetRunsheet").addEventListener("click", resetRunsheet);

renderComponentList();
renderForm();
updateOutput();

function component(id, name, lane, minutes, purpose) {
  return { id, name, lane, minutes, purpose };
}

function renderComponentList() {
  componentList.innerHTML = "";
  components.forEach((item) => {
    const label = document.createElement("label");
    label.className = "component-option";
    if (state.selected.includes(item.id)) label.classList.add("active");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selected.includes(item.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked && !state.selected.includes(item.id)) state.selected.push(item.id);
      if (!checkbox.checked) state.selected = state.selected.filter((id) => id !== item.id);
      label.classList.toggle("active", checkbox.checked);
      persistState();
      updateOutput();
    });

    const text = document.createElement("span");
    text.innerHTML = `<strong>${item.name}</strong><span>${item.lane} - about ${item.minutes} min</span>`;

    label.append(checkbox, text);
    componentList.appendChild(label);
  });
}

function renderForm() {
  form.innerHTML = "";
  const fields = [
    field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
    field("showTitle", "Show title"),
    field("episodeCode", "Episode code or date"),
    field("mode", "Run mode", "select", ["structured experiment", "freestyle with prepared segues", "guest episode", "current events episode", "recording test"]),
    field("targetLength", "Working length"),
    field("recordingContext", "Recording context", "textarea", null, "Location, guests, live/recorded, source freshness, or production notes."),
    field("openingLine", "Opening line", "textarea"),
    field("leadStory", "Lead story", "textarea"),
    field("mainHook", "Hook for main story", "textarea"),
    field("mainQuestion", "Main question", "textarea"),
    field("blueDogSpace", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
    field("redDogFrame", "Luke / Red Dog frame", "textarea", null, "One plain setup for the showrunner. Avoid loading the intro with backend detail."),
    field("guestPlan", "Guest or invitee plan", "textarea", null, "Include chosen animal and nickname only after the guest chooses them."),
    field("adNotes", "Ads, sponsor or support notes", "textarea"),
    field("recurringChoices", "Recurring show bits to use", "textarea", null, "Example: News Flash, Good Dog, Weather Window."),
    field("microChoices", "Micro scenes to use", "textarea", null, "Example: postie arrives, research time-lapse, walk and talk."),
    field("sourceChecks", "Source checks before recording", "textarea"),
    field("preparedSegues", "Prepared segues", "textarea", null, "Short transition lines for freestyle runs or if the yarn changes direction."),
    field("closingNotes", "Closing and next action", "textarea")
  ];

  fields.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.textContent = item.label;
    wrapper.appendChild(label);

    const input = createInput(item, state.data[item.id] || defaultValue(item.id));
    input.addEventListener("input", () => updateField(item.id, input.value));
    input.addEventListener("change", () => updateField(item.id, input.value));
    wrapper.appendChild(input);

    if (item.hint) {
      const hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = item.hint;
      wrapper.appendChild(hint);
    }

    form.appendChild(wrapper);
  });
}

function createInput(config, value) {
  if (config.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.id = config.id;
    textarea.value = value;
    return textarea;
  }

  if (config.type === "select") {
    const select = document.createElement("select");
    select.id = config.id;
    config.options.forEach((option) => {
      const node = document.createElement("option");
      node.value = option;
      node.textContent = option;
      select.appendChild(node);
    });
    select.value = value || config.options[0];
    state.data[config.id] = select.value;
    persistState();
    return select;
  }

  const input = document.createElement("input");
  input.id = config.id;
  input.type = "text";
  input.value = value;
  return input;
}

function field(id, label, type = "text", options = null, hint = "") {
  return { id, label, type, options, hint };
}

function defaultValue(id) {
  const defaults = {
    status: "seed",
    showTitle: "Two Dogs working runsheet",
    episodeCode: dateStamp(),
    targetLength: "open - experiment on recording day",
    openingLine: "Mate... I reckon the world's gone a bit strange.",
    leadStory: "The lead story or yarn that deserves the first serious turn.",
    mainHook: "What is the small question that makes this bigger idea easier to enter?",
    mainQuestion: "What are we actually trying to understand by the end of the show?",
    redDogFrame: "Luke / Red Dog sets the doorway in normal language, then lets the conversation move.",
    guestPlan: "Guest animals and nicknames are guest-chosen only.",
    adNotes: "Keep ads short, clearly labelled and native to the Two Dogs world.",
    recurringChoices: "Good Dog, Bad Dog, News Flash, Weather Window, Music Drop",
    microChoices: "Research time-lapse, walk and talk, can crack, ferry watch",
    sourceChecks: "Refresh current events, weather, sports, public claims and sponsor claims on recording day.",
    preparedSegues: "That probably opens a bigger gate.\nLet's take the dogs for a walk and come back to the main thing.\nBefore we run our mouths, what do we actually know?\nThis might be a segment, not the whole episode.",
    closingNotes: "Name the useful takeaway, thank guests or allies, and point to the next doorway."
  };
  return defaults[id] || "";
}

function updateField(id, value) {
  state.data[id] = value;
  persistState();
  updateOutput();
}

function setSelected(ids) {
  state.selected = [...ids];
  persistState();
  renderComponentList();
  updateOutput();
}

function applyPreset(ids, mode) {
  state.selected = [...ids];
  state.data.mode = mode;
  persistState();
  renderComponentList();
  renderForm();
  updateOutput();
}

function updateOutput() {
  const data = currentData();
  const selected = selectedComponents();
  markdown.value = renderMarkdown(data, selected);
  filename.textContent = `runsheet-${dateStamp()}-${slugify(data.showTitle)}.md`;
  preview.innerHTML = renderPreview(data, selected);
  statusLine.textContent = "Autosaved in this browser.";
}

function selectedComponents() {
  return components.filter((item) => state.selected.includes(item.id));
}

function currentData() {
  const keys = [
    "status",
    "showTitle",
    "episodeCode",
    "mode",
    "targetLength",
    "recordingContext",
    "openingLine",
    "leadStory",
    "mainHook",
    "mainQuestion",
    "blueDogSpace",
    "redDogFrame",
    "guestPlan",
    "adNotes",
    "recurringChoices",
    "microChoices",
    "sourceChecks",
    "preparedSegues",
    "closingNotes"
  ];
  return Object.fromEntries(keys.map((key) => [key, state.data[key] || defaultValue(key)]));
}

function renderMarkdown(data, selected) {
  return doc([
    heading("Two Dogs Runsheet", data.showTitle),
    meta(data),
    section("Core Boundaries", coreBoundary),
    section("Run Mode", data.mode),
    section("Recording Context", data.recordingContext),
    section("Opening Line", data.openingLine),
    section("Lead Story", data.leadStory),
    section("Hook For Main Story", data.mainHook),
    section("Main Question", data.mainQuestion),
    section("Blue Dog Space", blueDog(data.blueDogSpace)),
    section("Luke / Red Dog Frame", data.redDogFrame),
    section("Guest Or Invitee Plan", data.guestPlan),
    section("Ads Sponsor Or Support Notes", data.adNotes),
    listSection("Recurring Show Bits To Use", data.recurringChoices),
    listSection("Micro Scenes To Use", data.microChoices),
    listSection("Prepared Segues", data.preparedSegues),
    listSection("Source Checks Before Recording", data.sourceChecks),
    section("Showrunner Timeline", timelineMarkdown(data, selected)),
    section("Closing And Next Action", data.closingNotes)
  ]);
}

function renderPreview(data, selected) {
  const blocks = timelineBlocks(data, selected);
  const nav = blocks
    .map((block) => `<a href="#${block.anchor}">${escapeHtml(block.shortName)}</a>`)
    .join("");
  const cards = blocks.map(renderBlock).join("");
  return `
    <div class="runsheet-topline">
      <span>${escapeHtml(data.episodeCode)}</span>
      <span>${escapeHtml(data.mode)}</span>
      <span>${escapeHtml(data.targetLength)}</span>
      <span>${escapeHtml(data.status)}</span>
    </div>
    <h2>${escapeHtml(data.showTitle)}</h2>
    <p class="runsheet-summary">${escapeHtml(data.mainHook)}</p>
    <nav class="runsheet-jump-nav" aria-label="Runsheet sections">${nav}</nav>
    <div class="runsheet-timeline">${cards}</div>
    <div class="runsheet-notes"><strong>Prepared segues:</strong><br />${escapeLines(data.preparedSegues)}</div>
  `;
}

function timelineMarkdown(data, selected) {
  const blocks = timelineBlocks(data, selected);
  return blocks
    .map((block) => `- ${block.start} ${block.name} (about ${block.minutes} min): ${block.note}${block.segue ? ` Segue: ${block.segue}` : ""}`)
    .join("\n");
}

function timelineBlocks(data, selected) {
  let elapsed = 0;
  return selected.map((item) => {
    const block = {
      ...item,
      start: formatMinutes(elapsed),
      note: blockNote(item, data),
      segue: blockSegue(item, data),
      anchor: `run-${item.id}`,
      shortName: item.name.replace(/\s*\/\s*/g, " / ")
    };
    elapsed += item.minutes;
    return block;
  });
}

function renderBlock(block) {
  return `
    <article class="runsheet-block ${blockClass(block)}" id="${block.anchor}">
      <div class="runsheet-block-header">
        <h3>${escapeHtml(block.name)}</h3>
        <span class="runsheet-time">${escapeHtml(block.start)} / about ${block.minutes} min</span>
      </div>
      <small>${escapeHtml(block.lane)}</small>
      <p>${escapeHtml(block.note)}</p>
      ${block.segue ? `<p><strong>Segue:</strong> ${escapeHtml(block.segue)}</p>` : ""}
    </article>
  `;
}

function blockNote(item, data) {
  const notes = {
    "opening-theme": data.openingLine,
    "host-check-in": `${blueDogShort(data.blueDogSpace)} ${data.redDogFrame}`,
    "lead-story-hook": data.mainHook,
    "main-yarn": `${data.leadStory} Main question: ${data.mainQuestion}`,
    "source-check": data.sourceChecks,
    "guest-onboarding": data.guestPlan,
    "ad-break-one": data.adNotes,
    "news-flash": `Use only if fresh and sourced. ${data.recurringChoices}`,
    "good-dog": data.recurringChoices,
    "bad-dog": "Handle carefully: name only what the source supports.",
    "weather-window": "Check weather, tide, ferry and outdoor conditions close to recording.",
    "music-drop": "Use as a mood bridge or soundtrack note; check rights before using real tracks.",
    "film-art-games": "Turn the idea into a scene, poster, screening, game or visual test.",
    "micro-scene-pack": data.microChoices,
    "walk-and-talk": "Move the yarn outside and use place as the bridge back to the main idea.",
    "freestyle-segue-bank": data.preparedSegues,
    "audience-onboarding": "Explain the doorway, not the whole backend.",
    "closing-round": data.closingNotes,
    "outro-theme": "Close with theme reprise, waves, laugh, howl or a clean next-episode button."
  };
  return clean(notes[item.id]) || item.purpose;
}

function blockSegue(item, data) {
  const segues = clean(data.preparedSegues).split(/\r?\n/).filter(Boolean);
  if (!segues.length) return "";
  const index = components.findIndex((componentItem) => componentItem.id === item.id);
  return segues[index % segues.length];
}

function blockClass(block) {
  if (block.lane === "Ad") return "ads";
  if (block.lane === "Story") return "story";
  if (block.lane === "Scene" || block.lane === "Recurring" || block.lane === "Culture") return "scene";
  if (block.lane === "Meta" || block.lane === "Evidence") return "meta";
  return "";
}

function downloadMarkdown() {
  const blob = new Blob([markdown.value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.textContent;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  statusLine.textContent = "Markdown download started.";
}

async function copyMarkdown() {
  await navigator.clipboard.writeText(markdown.value);
  statusLine.textContent = "Markdown copied.";
}

function resetRunsheet() {
  state = defaultState();
  persistState();
  renderComponentList();
  renderForm();
  updateOutput();
  statusLine.textContent = "Runsheet reset.";
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed && Array.isArray(parsed.selected) && parsed.data) return parsed;
  } catch (error) {
    console.warn("Could not load runsheet state", error);
  }
  return defaultState();
}

function defaultState() {
  return { selected: [...coreSet], data: {} };
}

function persistState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function doc(parts) {
  return parts.filter(Boolean).join("\n\n").trim() + "\n";
}

function heading(label, value) {
  return `# ${label}${value ? ` - ${clean(value)}` : ""}`;
}

function meta(data) {
  return [
    line("Status", data.status),
    line("Episode code", data.episodeCode),
    line("Working length", data.targetLength),
    line("Generated", dateStamp()),
    "Generated by Two Dogs runsheet builder."
  ].join("\n");
}

function section(label, value) {
  if (!clean(value)) return "";
  return `## ${label}\n\n${clean(value)}`;
}

function listSection(label, value) {
  const items = clean(value)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!items.length) return "";
  return `## ${label}\n\n${items.map((item) => `- ${item.replace(/^-+\s*/, "")}`).join("\n")}`;
}

function line(label, value) {
  if (!clean(value)) return "";
  return `${label}: ${clean(value)}`;
}

function blueDog(value) {
  if (clean(value)) return `Angel-supplied note:\n\n${clean(value)}`;
  return "[Blue Dog space - Angel to direct]";
}

function blueDogShort(value) {
  if (clean(value)) return `Blue Dog: ${clean(value)}`;
  return "Blue Dog: Angel-directed space.";
}

function clean(value) {
  return String(value || "").trim();
}

function formatMinutes(total) {
  const minutes = Math.floor(total);
  return `${String(minutes).padStart(2, "0")}:00`;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  const slug = clean(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "runsheet";
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeLines(value) {
  const lines = clean(value).split(/\r?\n/).filter(Boolean);
  if (!lines.length) return "No prepared segues yet.";
  return lines.map((line) => escapeHtml(line)).join("<br />");
}
