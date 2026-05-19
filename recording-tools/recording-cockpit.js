const LATEST_RUNSHEET_KEY = "two-dogs-latest-runsheet-md-v1";
const SESSION_KEY = "two-dogs-recording-cockpit-session-v1";
const CUSTOM_PAD_KEY = "two-dogs-recording-custom-pads-v1";

const fallbackBeats = [
  beat("00:00", "Opening Theme", 2, "Opening", "Theme sting, waves, title card and first line."),
  beat("02:00", "Host Check-In", 3, "Opening", "Angel directs Blue Dog. Luke / Red Dog frames the day."),
  beat("05:00", "Lead Story Hook", 5, "Story", "The useful question that opens the main yarn."),
  beat("10:00", "Main Story Yarn", 14, "Story", "Conversation, guest, debate, local example or source trail."),
  beat("24:00", "Source Check Pause", 3, "Evidence", "What is known, what is not, and what needs checking."),
  beat("27:00", "Micro Scene Pack", 2, "Scene", "Tiny cutaway: postie, gate, walk, can crack or research jump."),
  beat("29:00", "Ad / Sponsor Break", 2, "Ad", "Clearly labelled support or sponsor slot."),
  beat("31:00", "Good Dog / Bad Dog", 4, "Recurring", "Good news or careful bad-choice segment."),
  beat("35:00", "Closing Round", 4, "Closing", "Takeaway, thanks, next doorway."),
  beat("39:00", "Outro Theme", 1, "Closing", "Theme reprise, waves, laugh, howl or clean ending.")
];

const categoryLabels = {
  recording: "Recording",
  edit: "Edit",
  cue: "Cue",
  current: "Current",
  scene: "Scene",
  sound: "Sound",
  comedy: "Comedy",
  good: "Good",
  risk: "Risk",
  support: "Support"
};

const categoryTones = {
  recording: "green",
  edit: "ink",
  cue: "blue",
  current: "blue",
  scene: "teal",
  sound: "teal",
  comedy: "gold",
  good: "green",
  risk: "red",
  support: "gold"
};

const categoryOrder = ["recording", "edit", "cue", "current", "scene", "sound", "comedy", "good", "risk", "support"];

const controlPriority = {
  "Soft Mark": 10,
  "Can Crack": 20,
  "Dog Whistle": 30,
  "Keep This": 40,
  "Cut Later": 50,
  "Source Check": 60,
  "Blue Dog Cue": 70,
  "Guest Cue": 80,
  "Segue Ready": 90,
  "Ad Break": 100,
  "News Sting": 110,
  "Weather Check": 120,
  "Sports Check": 130,
  "UN Day": 140,
  "Good Dog": 150,
  "Bad Dog": 160,
  "Comedy Sting": 170,
  "Big Laugh": 180,
  "Gate Knock": 190,
  "Postie Arrives": 200,
  "Walk Scene": 210,
  Waves: 220,
  Kookaburra: 230,
  "Treat Bag": 240,
  "Ferry Horn": 250,
  "Research Later": 260,
  "Too Long": 270,
  "Reset Energy": 280,
  "Merch Cue": 290,
  "Dogs And Allies": 300
};

const controlImages = {
  "Soft Mark": "marker-pen.webp",
  "Can Crack": "prod-can-crack.webp",
  "Dog Whistle": "dog-whistle.webp",
  "Keep This": "keep-this-thumb.webp",
  "Cut Later": "prod-stop-cut.webp",
  "Source Check": "research-detective.webp",
  "Blue Dog Cue": "prod-producer-talk.webp",
  "Guest Cue": "prod-top-of-show.webp",
  "Segue Ready": "prod-segue.webp",
  "Ad Break": "prod-commercial-break.webp",
  "News Sting": "prod-news-flash.webp",
  "Weather Check": "prod-rain-wind.webp",
  "Sports Check": "sports-ball.webp",
  "UN Day": "pirate-flag.webp",
  "Good Dog": "prod-good-dog.webp",
  "Bad Dog": "prod-bad-dog.webp",
  "Comedy Sting": "prod-comedy-minute.webp",
  "Big Laugh": "prod-laughter.webp",
  "Gate Knock": "prod-at-gate.webp",
  "Postie Arrives": "prod-door-knock.webp",
  "Walk Scene": "prod-walk-talk.webp",
  Waves: "prod-ocean-waves.webp",
  Kookaburra: "prod-birds-chirp.webp",
  "Treat Bag": "prod-dog-treats.webp",
  "Ferry Horn": "prod-ferry-watch.webp",
  "Research Later": "telescope-map.webp",
  "Too Long": "prod-timer-30-sec.webp",
  "Reset Energy": "prod-wisdom-moment.webp",
  "Merch Cue": "prod-sponsor-read.webp",
  "Dogs And Allies": "prod-applause.webp"
};

const controlImageRatios = {
  "marker-pen.webp": "184 / 130",
  "prod-can-crack.webp": "179 / 91",
  "dog-whistle.webp": "184 / 130",
  "keep-this-thumb.webp": "185 / 130",
  "prod-stop-cut.webp": "179 / 108",
  "research-detective.webp": "184 / 130",
  "prod-producer-talk.webp": "178 / 108",
  "prod-top-of-show.webp": "177 / 120",
  "prod-segue.webp": "178 / 120",
  "prod-commercial-break.webp": "176 / 120",
  "prod-news-flash.webp": "178 / 91",
  "prod-rain-wind.webp": "179 / 83",
  "sports-ball.webp": "184 / 128",
  "pirate-flag.webp": "185 / 127",
  "prod-good-dog.webp": "179 / 91",
  "prod-bad-dog.webp": "184 / 91",
  "prod-comedy-minute.webp": "176 / 91",
  "prod-laughter.webp": "179 / 108",
  "prod-at-gate.webp": "177 / 101",
  "prod-door-knock.webp": "179 / 83",
  "prod-walk-talk.webp": "179 / 101",
  "prod-ocean-waves.webp": "177 / 83",
  "prod-birds-chirp.webp": "177 / 83",
  "prod-dog-treats.webp": "179 / 101",
  "prod-ferry-watch.webp": "177 / 91",
  "telescope-map.webp": "184 / 128",
  "prod-timer-30-sec.webp": "179 / 108",
  "prod-wisdom-moment.webp": "179 / 91",
  "prod-sponsor-read.webp": "179 / 120",
  "prod-applause.webp": "177 / 108"
};

const defaultSfx = [
  sfx("Can Crack", "short", "can"),
  sfx("Dog Whistle", "sharp", "whistle"),
  sfx("Waves", "soft", "waves"),
  sfx("Kookaburra", "comic", "kookaburra"),
  sfx("News Sting", "current", "news"),
  sfx("Comedy Sting", "laugh", "comedy"),
  sfx("Good Dog", "win", "success"),
  sfx("Bad Dog", "warning", "buzz"),
  sfx("Gate Knock", "scene", "knock"),
  sfx("Treat Bag", "scene", "treat"),
  sfx("Ferry Horn", "place", "horn"),
  sfx("Soft Mark", "edit", "soft")
];

const defaultPads = [
  pad("Source Check", "ink", "marker"),
  pad("Blue Dog Cue", "blue", "soft"),
  pad("Guest Cue", "blue", "soft"),
  pad("Ad Break", "gold", "ding"),
  pad("Segue Ready", "blue", "marker"),
  pad("Cut Later", "red", "cut"),
  pad("Keep This", "green", "ding"),
  pad("Too Long", "red", "buzz"),
  pad("Big Laugh", "gold", "ding"),
  pad("Reset Energy", "ink", "soft"),
  pad("Postie Arrives", "teal", "knock"),
  pad("Walk Scene", "teal", "soft"),
  pad("Research Later", "ink", "marker"),
  pad("Weather Check", "blue", "marker"),
  pad("Sports Check", "blue", "marker"),
  pad("UN Day", "blue", "marker"),
  pad("Merch Cue", "gold", "ding"),
  pad("Dogs And Allies", "green", "ding")
];

const elements = {
  status: document.getElementById("recordingStatus"),
  elapsedClock: document.getElementById("elapsedClock"),
  runsheetFile: document.getElementById("runsheetFile"),
  syncLatest: document.getElementById("syncLatestRunsheet"),
  copyLog: document.getElementById("copyLog"),
  exportFormat: document.getElementById("exportFormat"),
  exportLog: document.getElementById("exportLog"),
  fullscreen: document.getElementById("fullscreenButton"),
  resetBeats: document.getElementById("resetBeats"),
  runsheetSource: document.getElementById("runsheetSource"),
  topbarSource: document.getElementById("topbarSource"),
  beatList: document.getElementById("beatList"),
  nextCard: document.getElementById("nextCard"),
  currentBeatLane: document.getElementById("currentBeatLane"),
  currentBeatLabel: document.getElementById("currentBeatLabel"),
  beatClock: document.getElementById("beatClock"),
  beatRemaining: document.getElementById("beatRemaining"),
  beatProgress: document.getElementById("beatProgress"),
  beatNote: document.getElementById("beatNote"),
  beatDurationSlider: document.getElementById("beatDurationSlider"),
  beatDurationValue: document.getElementById("beatDurationValue"),
  startPause: document.getElementById("startPauseButton"),
  resetTimer: document.getElementById("resetTimerButton"),
  prevBeat: document.getElementById("prevBeatButton"),
  nextBeat: document.getElementById("nextBeatButton"),
  sceneCut: document.getElementById("sceneCutButton"),
  sessionLog: document.getElementById("sessionLog"),
  clearLog: document.getElementById("clearLog"),
  quickNote: document.getElementById("quickNote"),
  addNote: document.getElementById("addNote"),
  controlDeck: document.getElementById("controlDeck"),
  controlKeyList: document.getElementById("controlKeyList"),
  resetPads: document.getElementById("resetPads"),
  customPadSelect: document.getElementById("customPadSelect"),
  customLabel: document.getElementById("customLabel"),
  customType: document.getElementById("customType"),
  customColour: document.getElementById("customColour"),
  saveCustomPad: document.getElementById("saveCustomPad")
};

let audioContext = null;
let beats = [...fallbackBeats];
let customPads = loadCustomPads();
let selectedPadIndex = 0;
let sourceLabel = "Freestyle fallback beats";
let currentBeat = 0;
let isRunning = false;
let sessionStartAt = 0;
let accumulatedMs = 0;
let beatStartAt = 0;
let beatAccumulatedMs = 0;
let logEntries = [];
let timerId = null;
let durationTrimBaseSeconds = null;

restoreSession();
bindControls();
renderSfx();
renderCustomPads();
renderBeats();
renderLog();
loadLatestRunsheet(false);
updateClocks();
document.body.dataset.activeTab = "live";

function beat(start, title, minutes, lane, note) {
  return { start, title, minutes, lane, note };
}

function sfx(label, hint, sound) {
  return { label, hint, sound };
}

function pad(label, colour, type) {
  return { label, colour, type };
}

function bindControls() {
  elements.syncLatest.addEventListener("click", () => loadLatestRunsheet(true));
  elements.runsheetFile.addEventListener("change", importRunsheetFile);
  elements.copyLog.addEventListener("click", copyLog);
  elements.exportLog.addEventListener("click", exportLog);
  elements.fullscreen.addEventListener("click", toggleFullscreen);
  elements.resetBeats.addEventListener("click", resetBeats);
  elements.startPause.addEventListener("click", toggleRunning);
  elements.resetTimer.addEventListener("click", resetTimers);
  elements.beatDurationSlider.addEventListener("pointerdown", beginBeatTrim);
  elements.beatDurationSlider.addEventListener("focus", beginBeatTrim);
  elements.beatDurationSlider.addEventListener("input", previewCurrentBeatTrim);
  elements.beatDurationSlider.addEventListener("change", commitCurrentBeatTrim);
  elements.prevBeat.addEventListener("click", () => moveBeat(-1));
  elements.nextBeat.addEventListener("click", () => moveBeat(1));
  elements.sceneCut.addEventListener("click", sceneCut);
  elements.clearLog.addEventListener("click", clearLog);
  elements.addNote.addEventListener("click", addQuickNote);
  elements.quickNote.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") addQuickNote();
  });
  elements.resetPads.addEventListener("click", resetPads);
  elements.saveCustomPad.addEventListener("click", saveSelectedPad);
  elements.customPadSelect.addEventListener("change", () => selectPad(Number(elements.customPadSelect.value)));
  document.querySelectorAll(".marker-button").forEach((button) => {
    button.addEventListener("click", () => mark(button.dataset.marker, "marker"));
  });
  document.querySelectorAll(".mobile-tabs button").forEach((button) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  });
  window.addEventListener("resize", handleDeckResize);
}

function restoreSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!saved) return;
    if (Array.isArray(saved.beats) && saved.beats.length) beats = saved.beats;
    if (Number.isInteger(saved.currentBeat)) currentBeat = Math.min(saved.currentBeat, beats.length - 1);
    if (Array.isArray(saved.logEntries)) logEntries = saved.logEntries;
    if (saved.sourceLabel) sourceLabel = saved.sourceLabel;
    accumulatedMs = Number(saved.accumulatedMs) || 0;
    beatAccumulatedMs = Number(saved.beatAccumulatedMs) || 0;
  } catch (error) {
    console.warn("Could not restore recording cockpit session", error);
  }
}

function persistSession() {
  const payload = {
    beats,
    currentBeat,
    logEntries,
    sourceLabel,
    accumulatedMs: elapsedMs(),
    beatAccumulatedMs: currentBeatMs()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

function loadCustomPads() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_PAD_KEY));
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (error) {
    console.warn("Could not load custom pads", error);
  }
  return [...defaultPads];
}

function persistCustomPads() {
  localStorage.setItem(CUSTOM_PAD_KEY, JSON.stringify(customPads));
}

function loadLatestRunsheet(announce) {
  try {
    const raw = localStorage.getItem(LATEST_RUNSHEET_KEY);
    if (!raw) {
      if (announce) log("Runsheet", "No builder output found in this browser yet.", "marker");
      renderBeats();
      return;
    }
    const payload = JSON.parse(raw);
    if (!payload || !payload.markdown) throw new Error("Missing markdown");
    applyRunsheet(payload.markdown, payload.filename || payload.showTitle || "latest builder output");
    if (announce) log("Runsheet", `Synced ${payload.filename || "latest builder output"}.`, "ding");
  } catch (error) {
    console.warn("Could not sync latest runsheet", error);
    if (announce) log("Runsheet", "Latest builder output could not be read.", "buzz");
  }
}

function applyRunsheet(markdown, label) {
  const parsed = parseRunsheet(markdown);
  beats = parsed.beats.length ? parsed.beats : fallbackBeats;
  sourceLabel = parsed.title ? `${parsed.title} (${label})` : label;
  currentBeat = 0;
  beatAccumulatedMs = 0;
  if (isRunning) beatStartAt = Date.now();
  log("Runsheet", `Loaded ${sourceLabel}.`, "marker");
  renderBeats();
  updateClocks();
  persistSession();
}

function parseRunsheet(markdown) {
  const lines = markdown.split(/\r?\n/);
  const titleLine = lines.find((line) => /^#\s+/.test(line));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : "";
  const timeline = [];
  let inTimeline = false;

  lines.forEach((line) => {
    if (/^##\s+Showrunner Timeline/i.test(line)) {
      inTimeline = true;
      return;
    }
    if (inTimeline && /^##\s+/.test(line)) {
      inTimeline = false;
      return;
    }
    if (!inTimeline || !/^\s*-\s+/.test(line)) return;
    timeline.push(parseTimelineLine(line));
  });

  const beatsFromHeadings = timeline.filter(Boolean);
  if (beatsFromHeadings.length) return { title, beats: beatsFromHeadings };

  const headings = lines
    .filter((line) => /^##\s+/.test(line))
    .slice(0, 10)
    .map((line, index) => beat(formatMinutes(index * 4), line.replace(/^##\s+/, ""), 4, "Section", "Imported from Markdown heading."));

  return { title, beats: headings };
}

function parseTimelineLine(line) {
  const cleanLine = line.replace(/^\s*-\s+/, "").trim();
  const match = cleanLine.match(/^(\d{1,2}:\d{2})\s+(.+?)\s+\(about\s+(\d+(?:\.\d+)?\s*min|\d+:\d{2}(?::\d{2})?)\):\s*(.*)$/i);
  if (match) {
    const [, start, title, duration, note] = match;
    return beat(start, title.trim(), durationLabelToMinutes(duration), inferLane(title, note), note.trim());
  }
  const fallbackTitle = cleanLine.replace(/\s*:\s*.*$/, "");
  return beat("00:00", fallbackTitle, 3, "Imported", cleanLine);
}

function inferLane(title, note) {
  const text = `${title} ${note}`.toLowerCase();
  if (text.includes("ad") || text.includes("sponsor")) return "Ad";
  if (text.includes("source") || text.includes("check")) return "Evidence";
  if (text.includes("scene") || text.includes("walk") || text.includes("cutaway")) return "Scene";
  if (text.includes("good dog") || text.includes("bad dog") || text.includes("news") || text.includes("weather")) return "Recurring";
  if (text.includes("closing") || text.includes("outro")) return "Closing";
  if (text.includes("opening") || text.includes("theme")) return "Opening";
  return "Story";
}

function importRunsheetFile(event) {
  const [file] = event.target.files;
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => applyRunsheet(String(reader.result || ""), file.name));
  reader.readAsText(file);
  event.target.value = "";
}

function renderBeats() {
  elements.runsheetSource.textContent = sourceLabel;
  if (elements.topbarSource) elements.topbarSource.textContent = sourceLabel;
  elements.beatList.innerHTML = "";
  beats.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `beat-item${index === currentBeat ? " active" : ""}`;
    button.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.start)} / about ${formatBeatDuration(item)} / ${escapeHtml(item.lane)}</span>`;
    button.addEventListener("click", () => jumpToBeat(index));
    elements.beatList.appendChild(button);
  });
  renderNextCard();
  syncDurationControl();
}

function renderNextCard() {
  const next = beats[currentBeat + 1];
  elements.nextCard.innerHTML = next
    ? `<strong>Next:</strong> ${escapeHtml(next.title)}<br><span>${escapeHtml(next.note)}</span>`
    : "<strong>Next:</strong> End of current runsheet.";
}

function renderSfx() {
  renderControlDeck();
  renderControlKey();
}

function renderCustomPads() {
  elements.customPadSelect.innerHTML = "";
  customPads.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.label;
    elements.customPadSelect.appendChild(option);
  });
  renderControlDeck();
  renderControlKey();
  selectPad(Math.min(selectedPadIndex, customPads.length - 1));
}

function selectPad(index) {
  selectedPadIndex = index;
  const item = customPads[index];
  if (!item) return;
  elements.customPadSelect.value = String(index);
  elements.customLabel.value = item.label;
  elements.customType.value = item.type;
  elements.customColour.value = item.colour;
  elements.controlDeck.querySelectorAll("[data-pad-index]").forEach((child) => {
    child.classList.toggle("selected", Number(child.dataset.padIndex) === index);
  });
}

function renderControlDeck() {
  if (!elements.controlDeck) return;
  const controls = buildControls();
  elements.controlDeck.innerHTML = "";
  chunkControls(controls, controlsPerDeckPage()).forEach((group) => {
    const page = document.createElement("div");
    page.className = "deck-page";
    group.forEach((control) => page.appendChild(createDeckButton(control)));
    elements.controlDeck.appendChild(page);
  });
}

function controlsPerDeckPage() {
  return window.matchMedia("(min-width: 821px)").matches ? 16 : 8;
}

let lastDeckPageSize = controlsPerDeckPage();

function handleDeckResize() {
  const nextSize = controlsPerDeckPage();
  if (nextSize === lastDeckPageSize) return;
  lastDeckPageSize = nextSize;
  renderControlDeck();
}

function buildControls() {
  const sfxControls = defaultSfx.map((item) => ({
    kind: "sfx",
    label: item.label,
    hint: item.hint,
    icon: iconForSound(item.sound),
    abbr: abbreviationForLabel(item.label),
    sound: item.sound,
    category: categoryForSound(item.sound)
  }));
  const padControls = customPads.map((item, index) => ({
    kind: "pad",
    label: item.label,
    hint: item.type,
    icon: iconForPadType(item.type),
    abbr: abbreviationForLabel(item.label),
    colour: item.colour,
    type: item.type,
    index,
    category: categoryForPad(item)
  }));
  return [...sfxControls, ...padControls]
    .map((control) => enrichControl(control))
    .sort(compareControls);
}

function createDeckButton(control) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `deck-button ${control.kind} cat-${control.category} ${control.tone}${control.image ? " has-image" : ""}`;
  button.setAttribute("aria-label", `${control.group}: ${control.label}: ${control.hint}`);
  button.title = `${control.group}: ${control.label}: ${control.hint}`;
  if (control.image) {
    button.style.setProperty("--button-image", `url("../assets/cockpit-buttons/${control.image}")`);
    button.style.setProperty("--button-ratio", control.imageRatio);
    button.innerHTML = `<span class="deck-abbr">${escapeHtml(control.abbr)}</span>`;
  } else {
    button.innerHTML = `<span class="deck-icon">${escapeHtml(control.icon)}</span><span class="deck-abbr">${escapeHtml(control.abbr)}</span>`;
  }
  if (control.kind === "sfx") {
    button.addEventListener("click", () => {
      flashDeckButton(button);
      playSound(control.sound);
      log("SFX", control.label, control.sound);
    });
  } else {
    button.dataset.padIndex = String(control.index);
    button.classList.toggle("selected", control.index === selectedPadIndex);
    button.addEventListener("click", () => {
      flashDeckButton(button);
      selectedPadIndex = control.index;
      selectPad(control.index);
      triggerPad(customPads[control.index]);
    });
  }
  return button;
}

function flashDeckButton(button) {
  button.classList.remove("fired");
  void button.offsetWidth;
  button.classList.add("fired");
  window.setTimeout(() => button.classList.remove("fired"), 220);
}

function renderControlKey() {
  if (!elements.controlKeyList) return;
  const controls = buildControls();
  elements.controlKeyList.innerHTML = "";
  controls.forEach((control) => {
    const item = document.createElement("div");
    item.className = `key-item ${control.kind} cat-${control.category} ${control.tone}${control.image ? " has-image" : ""}`;
    if (control.image) {
      const imageUrl = `../assets/cockpit-buttons/${control.image}`;
      item.innerHTML = `<span class="key-thumb" style="--button-image: url('${imageUrl}'); --button-ratio: ${control.imageRatio};"><strong>${escapeHtml(control.abbr)}</strong></span><span><strong>${escapeHtml(control.label)}</strong><em>${escapeHtml(control.group)} / ${escapeHtml(control.hint)}</em></span>`;
    } else {
      item.innerHTML = `<span class="key-code"><b>${escapeHtml(control.icon)}</b><strong>${escapeHtml(control.abbr)}</strong></span><span><strong>${escapeHtml(control.label)}</strong><em>${escapeHtml(control.group)} / ${escapeHtml(control.hint)}</em></span>`;
    }
    elements.controlKeyList.appendChild(item);
  });
}

function chunkControls(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function abbreviationForLabel(label) {
  const fixed = {
    "Can Crack": "CAN",
    "Dog Whistle": "WSL",
    Waves: "WAV",
    Kookaburra: "KOO",
    "News Sting": "NEWS",
    "Comedy Sting": "COM",
    "Good Dog": "GOOD",
    "Bad Dog": "BAD",
    "Gate Knock": "GATE",
    "Treat Bag": "TRT",
    "Ferry Horn": "FERY",
    "Soft Mark": "MARK",
    "Source Check": "SRC",
    "Blue Dog Cue": "BLUE",
    "Guest Cue": "GST",
    "Ad Break": "AD",
    "Segue Ready": "SEG",
    "Cut Later": "CUT",
    "Keep This": "KEEP",
    "Too Long": "LONG",
    "Big Laugh": "LAFF",
    "Reset Energy": "RST",
    "Postie Arrives": "POST",
    "Walk Scene": "WALK",
    "Research Later": "RCH",
    "Weather Check": "WX",
    "Sports Check": "SPRT",
    "UN Day": "UN",
    "Merch Cue": "MRCH",
    "Dogs And Allies": "ALLY"
  };
  if (fixed[label]) return fixed[label];
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

function categoryForSound(sound) {
  const categories = {
    can: "recording",
    whistle: "sound",
    waves: "scene",
    kookaburra: "scene",
    news: "current",
    comedy: "comedy",
    success: "good",
    buzz: "risk",
    knock: "scene",
    treat: "scene",
    horn: "scene",
    soft: "edit"
  };
  return categories[sound] || "edit";
}

function categoryForPad(item) {
  const label = item.label.toLowerCase();
  if (item.type === "cut" || item.type === "buzz" || label.includes("too long")) return "risk";
  if (label.includes("blue") || label.includes("guest") || label.includes("segue")) return "cue";
  if (label.includes("ad") || label.includes("merch")) return "support";
  if (label.includes("weather") || label.includes("sports") || label.includes("un day")) return "current";
  if (label.includes("postie") || label.includes("walk")) return "scene";
  if (label.includes("keep") || label.includes("laugh") || label.includes("dogs")) return "good";
  if (label.includes("source") || label.includes("research") || label.includes("reset")) return "edit";
  if (item.type === "ding") return "good";
  if (item.type === "soft") return "cue";
  return "edit";
}

function enrichControl(control) {
  const category = control.category || "edit";
  return {
    ...control,
    group: categoryLabels[category] || "Other",
    image: controlImages[control.label] || "",
    imageRatio: controlImageRatios[controlImages[control.label]] || "16 / 9",
    priority: controlPriority[control.label] || 900 + categoryRank(category),
    tone: categoryTones[category] || "ink"
  };
}

function compareControls(left, right) {
  return (
    left.priority - right.priority ||
    categoryRank(left.category) - categoryRank(right.category) ||
    left.label.localeCompare(right.label)
  );
}

function categoryRank(category) {
  const rank = categoryOrder.indexOf(category);
  return rank === -1 ? categoryOrder.length : rank;
}

function saveSelectedPad(event) {
  event.preventDefault();
  const current = customPads[selectedPadIndex];
  if (!current) return;
  current.label = elements.customLabel.value.trim() || current.label;
  current.type = elements.customType.value;
  current.colour = elements.customColour.value;
  persistCustomPads();
  renderCustomPads();
  log("Custom Pad", `Saved ${current.label}.`, "marker");
}

function resetPads() {
  customPads = [...defaultPads];
  selectedPadIndex = 0;
  persistCustomPads();
  renderCustomPads();
  log("Custom Pads", "Reset programmable buttons.", "marker");
}

function triggerPad(item) {
  playSound(item.type);
  log("Pad", item.label, item.type);
}

function toggleRunning() {
  if (isRunning) {
    accumulatedMs = elapsedMs();
    beatAccumulatedMs = currentBeatMs();
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    elements.startPause.textContent = "GO";
    elements.startPause.dataset.icon = ">";
    elements.startPause.classList.remove("paused");
    elements.status.classList.remove("live");
    elements.status.lastChild.textContent = " Paused";
    log("Timer", "Paused.", "marker");
  } else {
    sessionStartAt = Date.now() - accumulatedMs;
    beatStartAt = Date.now() - beatAccumulatedMs;
    isRunning = true;
    timerId = setInterval(updateClocks, 250);
    elements.startPause.textContent = "PAU";
    elements.startPause.dataset.icon = "II";
    elements.startPause.classList.add("paused");
    elements.status.classList.add("live");
    elements.status.lastChild.textContent = " Live";
    log("Timer", "Started.", "ding");
  }
  updateClocks();
  persistSession();
}

function iconForSound(sound) {
  const icons = {
    can: "CAN",
    whistle: "~",
    waves: "~",
    kookaburra: "!",
    news: "N",
    comedy: "ha",
    success: "+",
    buzz: "!",
    knock: "G",
    treat: "T",
    horn: "H",
    soft: "."
  };
  return icons[sound] || ".";
}

function iconForPadType(type) {
  const icons = {
    marker: "*",
    cut: "CUT",
    soft: ".",
    ding: "+",
    buzz: "!",
    knock: "G",
    treat: "T",
    horn: "H"
  };
  return icons[type] || ".";
}

function resetTimers() {
  accumulatedMs = 0;
  beatAccumulatedMs = 0;
  sessionStartAt = Date.now();
  beatStartAt = Date.now();
  updateClocks();
  log("Timer", "Reset clocks.", "marker");
  persistSession();
}

function jumpToBeat(index) {
  if (index < 0 || index >= beats.length) return;
  currentBeat = index;
  beatAccumulatedMs = 0;
  beatStartAt = Date.now();
  renderBeats();
  updateClocks();
  log("Beat", `Jumped to ${beats[currentBeat].title}.`, "soft");
  persistSession();
}

function moveBeat(direction) {
  jumpToBeat(Math.max(0, Math.min(beats.length - 1, currentBeat + direction)));
}

function beginBeatTrim() {
  const item = beats[currentBeat];
  if (!item) return;
  durationTrimBaseSeconds = beatDurationSeconds(item);
}

function previewCurrentBeatTrim() {
  const item = beats[currentBeat];
  if (!item) return;
  if (durationTrimBaseSeconds === null) beginBeatTrim();
  const deltaSeconds = trimSliderToSeconds(elements.beatDurationSlider.value);
  const baseSeconds = durationTrimBaseSeconds || beatDurationSeconds(item);
  const nextSeconds = Math.max(1, Math.min(3600, baseSeconds + deltaSeconds));
  item.minutes = nextSeconds / 60;
  updateDurationOutput(nextSeconds, nextSeconds - baseSeconds);
  updateClocks();
}

function commitCurrentBeatTrim() {
  const item = beats[currentBeat];
  if (!item) return;
  const deltaSeconds = trimSliderToSeconds(elements.beatDurationSlider.value);
  const baseSeconds = durationTrimBaseSeconds || beatDurationSeconds(item);
  const finalSeconds = Math.max(1, Math.min(3600, baseSeconds + deltaSeconds));
  const effectiveDelta = finalSeconds - baseSeconds;
  const changed = effectiveDelta !== 0;
  item.minutes = finalSeconds / 60;
  durationTrimBaseSeconds = null;
  elements.beatDurationSlider.value = "0";
  renderBeats();
  updateClocks();
  if (changed) {
    log("Beat Length", `${item.title} ${effectiveDelta > 0 ? "lengthened" : "shortened"} by ${formatSecondsLabel(Math.abs(effectiveDelta))} to about ${formatBeatDuration(item)}.`, "marker");
  } else {
    persistSession();
  }
}

function syncDurationControl() {
  if (!elements.beatDurationSlider || !elements.beatDurationValue) return;
  const item = beats[currentBeat] || fallbackBeats[0];
  const seconds = beatDurationSeconds(item);
  elements.beatDurationSlider.value = "0";
  elements.beatDurationSlider.min = "-100";
  elements.beatDurationSlider.max = "100";
  updateDurationOutput(seconds, 0);
}

function updateDurationOutput(seconds, deltaSeconds) {
  if (!elements.beatDurationValue) return;
  const deltaText = deltaSeconds === 0 ? "set" : `${deltaSeconds > 0 ? "+" : "-"}${formatSecondsLabel(Math.abs(deltaSeconds))}`;
  elements.beatDurationValue.textContent = `${formatSecondsLabel(seconds)} ${deltaText}`;
}

function trimSliderToSeconds(value) {
  const raw = Math.max(-100, Math.min(100, Math.round(Number(value) || 0)));
  if (raw === 0) return 0;
  const sign = Math.sign(raw);
  const amount = Math.abs(raw) / 100;
  const curve = 5.2;
  const scaled = (Math.exp(curve * amount) - 1) / (Math.exp(curve) - 1);
  return sign * Math.max(1, Math.round(scaled * 3600));
}

function beatDurationSeconds(item) {
  return Math.max(1, Math.round((Number(item.minutes) || 1) * 60));
}

function durationLabelToMinutes(label) {
  const clean = String(label || "").trim().toLowerCase();
  if (clean.endsWith("min")) return Number(clean.replace(/\s*min$/, "")) || 1;
  const parts = clean.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 1;
  if (parts.length === 3) return ((parts[0] * 3600) + (parts[1] * 60) + parts[2]) / 60;
  if (parts.length === 2) return ((parts[0] * 60) + parts[1]) / 60;
  return 1;
}

function formatBeatDuration(item) {
  return formatSecondsLabel(beatDurationSeconds(item));
}

function formatSecondsLabel(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function sceneCut() {
  playSound("cut");
  log("SCENE CUT", beats[currentBeat]?.title || "Freestyle", "cut");
}

function mark(label, sound) {
  playSound(sound);
  log("Marker", label, sound);
}

function addQuickNote() {
  const note = elements.quickNote.value.trim();
  if (!note) return;
  log("Note", note, "marker");
  elements.quickNote.value = "";
}

function clearLog() {
  logEntries = [];
  renderLog();
  persistSession();
}

function log(type, label, sound) {
  const entry = {
    at: formatDuration(elapsedMs()),
    beat: beats[currentBeat]?.title || "No beat",
    type,
    label,
    sound,
    recordedAt: new Date().toISOString()
  };
  logEntries.unshift(entry);
  logEntries = logEntries.slice(0, 220);
  renderLog();
  persistSession();
}

function renderLog() {
  elements.sessionLog.innerHTML = "";
  logEntries.forEach((entry) => {
    const item = document.createElement("li");
    item.innerHTML = `<time>${escapeHtml(entry.at)}</time><strong>${escapeHtml(entry.type)} - ${escapeHtml(entry.label)}</strong><span>${escapeHtml(entry.beat)}</span>`;
    elements.sessionLog.appendChild(item);
  });
}

function elapsedMs() {
  return isRunning ? Date.now() - sessionStartAt : accumulatedMs;
}

function currentBeatMs() {
  return isRunning ? Date.now() - beatStartAt : beatAccumulatedMs;
}

function updateClocks() {
  const item = beats[currentBeat] || fallbackBeats[0];
  const beatMs = currentBeatMs();
  const totalBeatMs = Math.max(1000, beatDurationSeconds(item) * 1000);
  const remainingMs = Math.max(0, totalBeatMs - beatMs);
  const percent = Math.min(100, (beatMs / totalBeatMs) * 100);

  elements.elapsedClock.textContent = formatDuration(elapsedMs());
  elements.currentBeatLane.textContent = `${item.lane} / ${item.start} / about ${formatBeatDuration(item)}`;
  elements.currentBeatLabel.textContent = item.title;
  elements.beatClock.textContent = formatDuration(beatMs, true);
  elements.beatRemaining.textContent = remainingMs > 0 ? `${formatDuration(remainingMs, true)} remaining` : "Over planned beat time";
  elements.beatProgress.style.width = `${percent}%`;
  elements.beatNote.textContent = item.note;
}

function copyLog() {
  const payload = exportPayload();
  navigator.clipboard.writeText(payload.text).then(
    () => log("Export", `Copied session log ${payload.label}.`, "ding"),
    () => log("Export", "Clipboard copy failed.", "buzz")
  );
}

function exportLog() {
  const payload = exportPayload();
  const blob = new Blob([payload.text], { type: payload.mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `recording-log-${new Date().toISOString().slice(0, 10)}.${payload.extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  log("Export", `Downloaded session log ${payload.label}.`, "ding");
}

function selectedExportFormat() {
  return elements.exportFormat?.value || "md";
}

function exportPayload(format = selectedExportFormat()) {
  if (format === "srt") {
    return {
      extension: "srt",
      label: "SRT cues",
      mime: "application/x-subrip;charset=utf-8",
      text: logSrt()
    };
  }

  if (format === "txt") {
    return {
      extension: "txt",
      label: "plain text",
      mime: "text/plain;charset=utf-8",
      text: logText()
    };
  }

  return {
    extension: "md",
    label: "Markdown",
    mime: "text/markdown;charset=utf-8",
    text: logMarkdown()
  };
}

function chronologicalEntries() {
  return logEntries.slice().reverse();
}

function logMarkdown() {
  const active = beats[currentBeat] || {};
  const entries = chronologicalEntries()
    .map((entry) => `- ${entry.at} | ${entry.type} | ${entry.label} | beat: ${entry.beat}`)
    .join("\n");
  const beatList = beats.map((item) => `- ${item.start} ${item.title} (about ${formatBeatDuration(item)}): ${item.note}`).join("\n");
  const pads = customPads.map((item) => `- ${item.label} (${item.type}, ${item.colour})`).join("\n");
  return `# Two Dogs Recording Log

Source runsheet: ${sourceLabel}
Exported: ${new Date().toISOString()}
Elapsed: ${formatDuration(elapsedMs())}
Active beat: ${active.title || "No beat"}

## Beats

${beatList}

## Log Entries

${entries || "- No log entries yet."}

## Programmable Buttons

${pads}
`;
}

function logText() {
  const active = beats[currentBeat] || {};
  const beatList = beats
    .map((item) => `${item.start} | ${item.title} | about ${formatBeatDuration(item)} | ${item.note}`)
    .join("\n");
  const entries = chronologicalEntries()
    .map((entry) => `${entry.at} | ${entry.type} | ${entry.label} | beat: ${entry.beat}`)
    .join("\n");
  const pads = customPads.map((item) => `${item.label} (${item.type}, ${item.colour})`).join("\n");
  return `Two Dogs Recording Log

Source runsheet: ${sourceLabel}
Exported: ${new Date().toISOString()}
Elapsed: ${formatDuration(elapsedMs())}
Active beat: ${active.title || "No beat"}

BEATS
${beatList || "No beats."}

LOG ENTRIES
${entries || "No log entries yet."}

PROGRAMMABLE BUTTONS
${pads || "No programmable buttons."}
`;
}

function logSrt() {
  const entries = chronologicalEntries();
  if (!entries.length) return "";
  return `${entries.map((entry, index) => {
    const startSeconds = timestampToSeconds(entry.at);
    const nextStart = entries[index + 1] ? timestampToSeconds(entries[index + 1].at) : null;
    const naturalEnd = nextStart && nextStart > startSeconds ? Math.min(nextStart, startSeconds + 6) : startSeconds + 4;
    const endSeconds = Math.max(startSeconds + 1, naturalEnd);
    return `${index + 1}
${formatSrtTime(startSeconds)} --> ${formatSrtTime(endSeconds)}
${entry.type}: ${entry.label}
Beat: ${entry.beat}`;
  }).join("\n\n")}
`;
}

function timestampToSeconds(value) {
  const parts = String(value || "00:00:00").split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 3) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  if (parts.length === 2) return (parts[0] * 60) + parts[1];
  return parts[0] || 0;
}

function formatSrtTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},000`;
}

function resetBeats() {
  beats = [...fallbackBeats];
  sourceLabel = "Freestyle fallback beats";
  currentBeat = 0;
  beatAccumulatedMs = 0;
  renderBeats();
  updateClocks();
  log("Runsheet", "Reset to fallback beats.", "marker");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function activateTab(tabName) {
  document.body.dataset.activeTab = tabName;
  document.querySelectorAll(".mobile-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
}

function playSound(name) {
  if (name === "marker") return;
  const context = getAudioContext();
  const now = context.currentTime;
  const tones = soundPlan(name);
  tones.forEach((tone, index) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = tone.wave || "sine";
    osc.frequency.setValueAtTime(tone.frequency, now + index * 0.08);
    gain.gain.setValueAtTime(0.0001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(tone.gain || 0.18, now + index * 0.08 + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + tone.duration);
    osc.connect(gain).connect(context.destination);
    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + tone.duration + 0.02);
  });
}

function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function soundPlan(name) {
  const plans = {
    cut: [
      { frequency: 1250, duration: 0.12, gain: 0.22, wave: "square" },
      { frequency: 760, duration: 0.14, gain: 0.2, wave: "square" }
    ],
    soft: [{ frequency: 420, duration: 0.16, gain: 0.12 }],
    ding: [
      { frequency: 880, duration: 0.16, gain: 0.16 },
      { frequency: 1320, duration: 0.18, gain: 0.12 }
    ],
    buzz: [{ frequency: 130, duration: 0.28, gain: 0.14, wave: "sawtooth" }],
    can: [
      { frequency: 2200, duration: 0.04, gain: 0.14, wave: "square" },
      { frequency: 980, duration: 0.08, gain: 0.12, wave: "triangle" }
    ],
    whistle: [
      { frequency: 1800, duration: 0.12, gain: 0.13 },
      { frequency: 2400, duration: 0.12, gain: 0.11 }
    ],
    waves: [
      { frequency: 180, duration: 0.26, gain: 0.08, wave: "triangle" },
      { frequency: 240, duration: 0.26, gain: 0.06, wave: "triangle" }
    ],
    kookaburra: [
      { frequency: 720, duration: 0.08, gain: 0.12, wave: "square" },
      { frequency: 560, duration: 0.08, gain: 0.1, wave: "square" },
      { frequency: 820, duration: 0.1, gain: 0.12, wave: "square" }
    ],
    news: [
      { frequency: 660, duration: 0.1, gain: 0.16, wave: "triangle" },
      { frequency: 990, duration: 0.12, gain: 0.16, wave: "triangle" }
    ],
    comedy: [
      { frequency: 420, duration: 0.08, gain: 0.12 },
      { frequency: 520, duration: 0.08, gain: 0.12 },
      { frequency: 620, duration: 0.1, gain: 0.12 }
    ],
    success: [
      { frequency: 523, duration: 0.12, gain: 0.14 },
      { frequency: 784, duration: 0.16, gain: 0.14 }
    ],
    knock: [
      { frequency: 150, duration: 0.05, gain: 0.16, wave: "square" },
      { frequency: 150, duration: 0.05, gain: 0.16, wave: "square" }
    ],
    treat: [
      { frequency: 1600, duration: 0.05, gain: 0.12 },
      { frequency: 1900, duration: 0.05, gain: 0.1 },
      { frequency: 1500, duration: 0.05, gain: 0.1 }
    ],
    horn: [{ frequency: 185, duration: 0.42, gain: 0.14, wave: "sawtooth" }]
  };
  return plans[name] || plans.soft;
}

function formatDuration(ms, short = false) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (short) return `${String(minutes + hours * 60).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatMinutes(total) {
  return `${String(Math.floor(total)).padStart(2, "0")}:00`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.addEventListener("beforeunload", persistSession);
