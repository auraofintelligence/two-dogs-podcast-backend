const STORE_KEY = "two-dogs-micro-scene-builder-v1";

const sharedBoundary = [
  "- Angel is Blue Dog / Blue Heeler.",
  "- Blue Dog material is Angel-directed only.",
  "- Luke is Red Dog / Red Heeler.",
  "- Guests choose their own spirit animal character and nickname.",
  "- Micro scenes should support the yarn, not interrupt it for too long."
].join("\n");

const microScenes = [
  micro("postman-arrives", "Postman Arrives", "Interrupt", "4-7 seconds", "A postie, parcel, scooter, gate sound or mailbag cue breaks the conversation.", [
    "Frame 1: dogs freeze mid-yarn as the offscreen postie sound hits.",
    "Frame 2: paws scramble, ears up, tails go full alarm mode.",
    "Frame 3: the show snaps back with one dog trying to look professional."
  ], "Return to the topic as if nothing happened, except the dogs are slightly too proud of themselves.", "Keep the excitement funny, not aggressive."),
  micro("research-time-lapse", "Research Time-Lapse", "Research", "6-12 seconds", "Red Dog says he is going to check something before running his mouth.", [
    "Frame 1: Red Dog opens a laptop, notebook, old folder or source map.",
    "Frame 2: quick flashes of tabs, sticky notes, source trails and a '(time length) later' card.",
    "Frame 3: Red Dog returns with one plain-English finding and no giant lecture."
  ], "Return with the cleanest useful takeaway, not the whole research rabbit hole.", "Do not pretend a source was checked if it was not."),
  micro("someone-at-the-gate", "Someone At The Gate", "Interrupt", "3-6 seconds", "A gate latch, footsteps, neighbour voice or delivery sound pulls focus.", [
    "Frame 1: both dogs hear the gate before anyone else does.",
    "Frame 2: one dog trots to frame edge while the other holds the conversation.",
    "Frame 3: the visitor becomes a quick reason to shift scene or introduce a guest."
  ], "Use the gate as a natural transition into the next topic, guest or ad read.", "Ask before naming real neighbours or visitors."),
  micro("walk-and-talk", "Walk And Talk", "Movement", "8-15 seconds", "The conversation needs air, so the dogs take the yarn outside.", [
    "Frame 1: beach, path, ferry road, bush track or footpath establishes movement.",
    "Frame 2: dogs walk, sniff, pause and keep talking in small fragments.",
    "Frame 3: one visual detail becomes the bridge back to the main idea."
  ], "Return to seated conversation, beach mic, camp chair or next location.", "Use movement to simplify the idea, not dodge the hard part."),
  micro("tree-stop", "Tree Stop", "Dog business", "3-5 seconds", "One dog pauses mid-walk for a shameless tree stop.", [
    "Frame 1: the yarn is flowing until the tree enters frame.",
    "Frame 2: quick cutaway, tasteful framing, one guilty side-eye.",
    "Frame 3: back to the conversation with no apology except maybe a tail wag."
  ], "Return with a blunt line about basic needs, territory or priorities.", "Keep it cheeky and clean enough for public pages."),
  micro("fetch-stick", "Fetch The Stick", "Play", "4-8 seconds", "A stick becomes a sudden priority or metaphor.", [
    "Frame 1: stick lands, bounces or appears like a sacred object.",
    "Frame 2: one dog commits too hard; the other keeps the mic alive.",
    "Frame 3: the stick returns as a visual punchline or useful prop."
  ], "Use the stick as the bridge back to the idea: chasing, retrieving, testing or loyalty.", "Do not let the gag eat the scene."),
  micro("fetch-ball", "Fetch The Ball", "Play", "4-8 seconds", "A ball crosses the frame and turns the dogs into working athletes for three seconds.", [
    "Frame 1: ball roll, bounce or impossible slow-motion arc.",
    "Frame 2: chase, skid, sand spray, chair wobble or mic near-miss.",
    "Frame 3: ball lands beside the point the conversation was trying to make."
  ], "Return with a line about momentum, feedback loops or training the right habit.", "Keep impacts safe and cartoony."),
  micro("dog-treats", "Dog Treats", "Reward", "3-6 seconds", "A treat jar, snack bag or human bribe appears when the idea needs a reward beat.", [
    "Frame 1: treat sound cuts through all higher philosophy.",
    "Frame 2: perfect posture, laser focus, ridiculous obedience.",
    "Frame 3: treat lands, and the dogs suddenly approve of the plan."
  ], "Return by naming what deserves reward, thanks or support.", "Do not turn audience support into guilt-jar language."),
  micro("tail-sniff-check", "Tail Sniff Check", "Dog logic", "2-5 seconds", "Dog instinct interrupts human overthinking.", [
    "Frame 1: one dog circles with investigative seriousness.",
    "Frame 2: brief tail-sniff gag, quick enough to stay silly.",
    "Frame 3: the dogs act as if this was a valid due-diligence process."
  ], "Return with a line about checking assumptions before trusting a story.", "Keep it dog-body comedy, not guest embarrassment."),
  micro("grooming-reset", "Grooming Reset", "Reset", "4-7 seconds", "One dog fixes fur, collar, paws or dignity after a messy idea.", [
    "Frame 1: the conversation gets tangled.",
    "Frame 2: brush, shake, collar jingle, paw clean or camera-ready reset.",
    "Frame 3: both dogs look composed enough to continue."
  ], "Return with a clearer version of the point.", "Use grooming as reset, not vanity."),
  micro("beach-zoomies", "Beach Zoomies", "Energy", "5-9 seconds", "The idea suddenly has too much energy to sit still.", [
    "Frame 1: pause, eye contact, then launch.",
    "Frame 2: loop of sand, waterline, paws, microphone almost abandoned.",
    "Frame 3: dogs return puffed, happy and ready to simplify the idea."
  ], "Return by saying what the energy is really about.", "Keep zoomies joyful, not chaotic enough to break continuity."),
  micro("can-crack", "Can Crack", "Audio cue", "2-4 seconds", "A can crack, pour, clink or sponsor-style beat marks a topic shift.", [
    "Frame 1: close-up of can or stubby holder, not a full ad unless intended.",
    "Frame 2: fizz, beach light, dog ears reacting to the sound.",
    "Frame 3: conversation resumes with a cleaner tone or cheeky reset."
  ], "Return with the next segment, mock sponsor or campfire-style yarn.", "Use alcohol cues lightly and avoid pressure-to-drink energy."),
  micro("ferry-watch", "Ferry Watch", "Island", "5-10 seconds", "A ferry, boat horn, wake or bay crossing becomes the scene bridge.", [
    "Frame 1: ferry crosses the background or horn lands over the line.",
    "Frame 2: dogs watch the water like it contains the answer.",
    "Frame 3: wake rolls in as the conversation moves to the next place."
  ], "Return with a place-based line: from Meanjin to Minjerribah, from local to wider world.", "Check place names and local context before making big claims."),
  micro("guest-animal-reveal", "Guest Animal Reveal", "Guest", "5-10 seconds", "A guest-chosen spirit animal and nickname enters the world.", [
    "Frame 1: keep the guest human voice centred while the animal silhouette forms.",
    "Frame 2: reveal the guest-chosen animal and nickname exactly as supplied.",
    "Frame 3: the animal joins the yarn without stealing the guest's agency."
  ], "Return by asking the guest what the choice means in their own words.", "Never assign the guest's animal, nickname, traits or motive for them.")
];

let savedState = loadState();
let activeMicro = requestedMicroId() || savedState.activeMicro || microScenes[0].id;
if (!microScenes.some((item) => item.id === activeMicro)) activeMicro = microScenes[0].id;

const picker = document.getElementById("microScenePicker");
const search = document.getElementById("microSceneSearch");
const form = document.getElementById("microForm");
const title = document.getElementById("microTitle");
const type = document.getElementById("microType");
const preview = document.getElementById("microPreview");
const filename = document.getElementById("microFilename");
const statusLine = document.getElementById("microStatus");

document.getElementById("microDownload").addEventListener("click", downloadMarkdown);
document.getElementById("microCopy").addEventListener("click", copyMarkdown);
document.getElementById("microReset").addEventListener("click", resetActiveForm);
search.addEventListener("input", renderPicker);

renderPicker();
renderForm();

function micro(id, name, lane, duration, trigger, frames, returnLine, boundary) {
  return { id, name, lane, duration, trigger, frames, returnLine, boundary };
}

function renderPicker() {
  const query = clean(search.value).toLowerCase();
  picker.innerHTML = "";

  microScenes
    .filter((item) => !query || `${item.name} ${item.lane} ${item.trigger}`.toLowerCase().includes(query))
    .forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = item.id === activeMicro ? "active" : "";
      button.dataset.micro = item.id;
      button.setAttribute("aria-pressed", item.id === activeMicro ? "true" : "false");
      button.innerHTML = `<strong>${item.name}</strong><span>${item.lane} - ${item.duration}</span>`;
      button.addEventListener("click", () => {
        activeMicro = item.id;
        savedState.activeMicro = activeMicro;
        persistState();
        updateMicroUrl(item.id);
        renderPicker();
        renderForm();
      });
      picker.appendChild(button);
    });
}

function renderForm() {
  const item = getMicro(activeMicro);
  const data = getData(activeMicro);
  const defaults = defaultData(item);
  type.textContent = item.lane;
  title.textContent = item.name;
  form.innerHTML = "";

  const fields = [
    field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
    field("episodeLink", "Episode, scene or segment link", "text", null, "Optional. Keep this attached to the bigger yarn."),
    field("duration", "Target screen time", "text", null, "Short is the point."),
    field("trigger", "Entry trigger", "textarea", null, "Sound, line, prop or interruption that starts the beat."),
    field("frames", "Three short frames", "textarea", null, "One frame per line works best."),
    field("timeCard", "Optional time card", "text", null, "Example: (three minutes later). Useful for research jumps."),
    field("blueDogSpace", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
    field("redDogBeat", "Red Dog beat", "textarea", null, "One Red Dog line, look, action or research move."),
    field("guestAnimalBoundary", "Guest or ally animal boundary", "textarea", null, "Only use guest animal or nickname details after they choose them."),
    field("returnLine", "Return to conversation", "textarea", null, "How the gag or cutaway hands back to the topic."),
    field("sfxEditNotes", "SFX, camera or edit notes", "textarea", null, "Keep this practical: one or two cues."),
    field("reuseTag", "Reuse tag", "text", null, "Example: interrupt, research, walk, play, guest-intro."),
    field("boundary", "Do not overdo", "textarea", null, "The line that keeps the beat funny, brief and usable."),
    field("nextAction", "Next useful action", "textarea")
  ];

  fields.forEach((fieldConfig) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.htmlFor = fieldConfig.id;
    label.textContent = fieldConfig.label;
    wrapper.appendChild(label);

    const input = createInput(fieldConfig, data[fieldConfig.id] || defaults[fieldConfig.id] || "");
    input.addEventListener("input", () => updateField(fieldConfig.id, input.value));
    input.addEventListener("change", () => updateField(fieldConfig.id, input.value));
    wrapper.appendChild(input);

    if (fieldConfig.hint) {
      const hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = fieldConfig.hint;
      wrapper.appendChild(hint);
    }

    form.appendChild(wrapper);
  });

  updatePreview();
}

function createInput(fieldConfig, value) {
  if (fieldConfig.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.id = fieldConfig.id;
    textarea.value = value;
    return textarea;
  }

  if (fieldConfig.type === "select") {
    const select = document.createElement("select");
    select.id = fieldConfig.id;
    fieldConfig.options.forEach((option) => {
      const node = document.createElement("option");
      node.value = option;
      node.textContent = option;
      select.appendChild(node);
    });
    select.value = value || fieldConfig.options[0];
    updateField(fieldConfig.id, select.value, false);
    return select;
  }

  const input = document.createElement("input");
  input.id = fieldConfig.id;
  input.type = "text";
  input.value = value;
  return input;
}

function field(id, label, type = "text", options = null, hint = "") {
  return { id, label, type, options, hint };
}

function defaultData(item) {
  return {
    duration: item.duration,
    trigger: item.trigger,
    frames: item.frames.join("\n"),
    returnLine: item.returnLine,
    redDogBeat: defaultRedDogBeat(item),
    guestAnimalBoundary: "Do not assign guest animal characters or nicknames. Record only what the guest chooses.",
    sfxEditNotes: defaultSfx(item),
    reuseTag: item.lane.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    boundary: item.boundary,
    nextAction: "Decide whether this is a one-off cutaway, a reusable micro scene, or part of a larger scene draft."
  };
}

function defaultRedDogBeat(item) {
  if (item.id === "research-time-lapse") return "Red Dog checks the deeper source trail, then returns with one useful plain-English line.";
  if (item.id === "guest-animal-reveal") return "Red Dog invites the guest to explain their chosen animal and nickname in their own words.";
  return "Red Dog names the doorway, lets the gag land, then brings the yarn back.";
}

function defaultSfx(item) {
  if (item.id === "can-crack") return "SFX: can crack, fizz, tiny pause, conversation resumes.";
  if (item.id === "postman-arrives") return "SFX: scooter, gate latch, bark burst, quick professional reset.";
  if (item.id === "ferry-watch") return "SFX: ferry horn, waves, distant gulls, soft transition bed.";
  return "SFX: short natural cue, quick cut, no long music bed unless the episode needs it.";
}

function updateField(id, value, shouldRender = true) {
  const data = getData(activeMicro);
  data[id] = value;
  savedState.forms[activeMicro] = data;
  persistState();
  if (shouldRender) updatePreview();
}

function updatePreview() {
  const item = getMicro(activeMicro);
  const data = { ...defaultData(item), ...getData(activeMicro) };
  preview.value = renderMarkdown(item, data);
  filename.textContent = `micro-scene-${dateStamp()}-${slugify(item.name)}.md`;
  statusLine.textContent = "Autosaved in this browser.";
}

function renderMarkdown(item, data) {
  return doc([
    heading("Micro Scene", item.name),
    meta(data),
    section("Micro Scene Lane", item.lane),
    section("Core Boundaries", sharedBoundary),
    section("Episode Scene Or Segment Link", data.episodeLink),
    section("Target Screen Time", data.duration),
    section("Entry Trigger", data.trigger),
    listSection("Three Short Frames", data.frames),
    section("Optional Time Card", data.timeCard),
    section("Blue Dog Space", blueDog(data.blueDogSpace)),
    section("Red Dog Beat", data.redDogBeat),
    section("Guest Or Ally Animal Boundary", data.guestAnimalBoundary),
    section("Return To Conversation", data.returnLine),
    listSection("SFX Camera Or Edit Notes", data.sfxEditNotes),
    section("Reuse Tag", data.reuseTag),
    section("Do Not Overdo", data.boundary),
    section("Next Useful Action", data.nextAction)
  ]);
}

function downloadMarkdown() {
  const blob = new Blob([preview.value], { type: "text/markdown;charset=utf-8" });
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
  await navigator.clipboard.writeText(preview.value);
  statusLine.textContent = "Markdown copied.";
}

function resetActiveForm() {
  savedState.forms[activeMicro] = {};
  persistState();
  renderForm();
  statusLine.textContent = "Form reset.";
}

function getMicro(id) {
  return microScenes.find((item) => item.id === id) || microScenes[0];
}

function getData(id) {
  if (!savedState.forms[id]) savedState.forms[id] = {};
  return savedState.forms[id];
}

function requestedMicroId() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("micro");
  const fromHash = window.location.hash.replace(/^#/, "");
  return fromQuery || fromHash;
}

function updateMicroUrl(microId) {
  const url = new URL(window.location.href);
  url.searchParams.set("micro", microId);
  url.hash = "";
  window.history.replaceState({}, "", url);
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed && parsed.forms) return parsed;
  } catch (error) {
    console.warn("Could not load micro scene builder state", error);
  }
  return { activeMicro: microScenes[0].id, forms: {} };
}

function persistState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(savedState));
}

function doc(parts) {
  return parts.filter(Boolean).join("\n\n").trim() + "\n";
}

function heading(label, value) {
  return `# ${label}${value ? ` - ${value}` : ""}`;
}

function meta(data) {
  return [
    line("Status", data.status || "seed"),
    line("Generated", dateStamp()),
    "Generated by Two Dogs micro scene pipeline form."
  ].join("\n");
}

function section(label, value) {
  if (!clean(value)) return "";
  return `## ${label}\n\n${clean(value)}`;
}

function listSection(label, value) {
  const items = clean(value)
    .split(/\r?\n/)
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
  if (clean(value)) {
    return `Angel-supplied note:\n\n${clean(value)}`;
  }
  return "[Blue Dog space - Angel to direct]";
}

function clean(value) {
  return String(value || "").trim();
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
  return slug || "draft";
}
