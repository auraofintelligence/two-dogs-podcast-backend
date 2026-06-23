const STORE_KEY = "two-dogs-recurring-scene-builder-v1";

const sharedBoundary = [
  "- Angel is Blue Dog / Blue Heeler.",
  "- Blue Dog material is Angel-directed only.",
  "- Luke is Red Dog / Red Heeler.",
  "- Guests choose their own spirit animal character and nickname.",
  "- Current events, weather, sports and public claims can use fresh source checks on recording day."
].join("\n");

const recurringScenes = [
  scene("news-flash", "News Flash", "Current", "Headline, source, date, place and current status.", "Check date, place, source, and whether this is confirmed or still developing.", [
    "What happened, and what is only headline heat?",
    "Where is the dog angle, if there is one?",
    "Could this become Good Dog, Bad Dog, source check, or just a quick mention?"
  ]),
  scene("comedy-minute", "Comedy Minute", "Comedy", "One quick joke, visual gag or absurd plain-English translation before the dense idea returns.", "Check the joke is punching up, not down.", [
    "What is the smallest funny version of this idea?",
    "What would a dog misunderstand in a useful way?",
    "Where does the laugh hand back to the actual yarn?"
  ]),
  scene("bad-dog", "Bad Dog", "Accountability", "Risk, poor process, documented choices, avoidable mess or public-interest failure.", "Careful wording helps here. Corruption claims need a reliable source, official finding, court record or admission.", [
    "What went wrong in plain language?",
    "What is sourced, and what still needs care?",
    "Is this a person problem, a system problem, or a gate left open?"
  ]),
  scene("good-dog", "Good Dog", "Wins", "What useful effort, achievement or community win deserves a quick salute?", "Verify the win and avoid turning it into hype.", [
    "Who did something worth noticing?",
    "What got easier, kinder or more useful because of it?",
    "What is the tiny trophy moment?"
  ]),
  scene("un-world-day", "UN World Day Of Whatever", "Calendar", "What official observance creates a useful doorway into the episode?", "Check the official UN observances list before calling it a UN day.", [
    "What is today's official doorway?",
    "What everyday ritual hides inside this global observance?",
    "How would the dogs make it local without pretending to solve the UN?"
  ]),
  scene("sports-desk", "Sports Desk", "Sport", "What did the game, club, rivalry or sporting moment teach us about people?", "Verify date, league, teams, score and whether the match has finished.", [
    "What was the actual sporting moment?",
    "What human ritual showed up around it: tribe, rule, grievance, glory or excuse?",
    "Where is the clean handoff back to the main yarn?"
  ]),
  scene("weather-window", "Weather Window", "Island", "What does the weather, tide, ferry mood or outdoor risk change about the day?", "Check the relevant forecast close to recording.", [
    "What is the sky doing to the mood of the show?",
    "Does the weather explain a delay, a mood swing, a ferry story or a dog decision?",
    "What one detail makes the place feel real?"
  ]),
  scene("music-drop", "Music Drop", "Sound", "What feeling, cue, lyric or track carries this moment?", "Check rights, credit and public/private source status before using actual music.", [
    "What sound would shift the room without stealing the scene?",
    "Is this a real track, a theme-song callback, or just a mood note?",
    "What memory or feeling does it open?"
  ]),
  scene("film-club", "Film Club", "Screen", "What would this idea look like as a scene, short, screening or animation test?", "Do not imply footage or references are cleared unless they are.", [
    "What film, scene or genre helps the idea become visible?",
    "What would the dogs notice that humans miss?",
    "Does this become a proper Film Club note or just a quick comparison?"
  ]),
  scene("art-show", "Art Show", "Visual", "What image, prop, exhibition, poster or artwork makes the idea easier to feel?", "Credit artists and avoid living-artist mimicry unless permission exists.", [
    "What image makes the abstract thing easier to feel?",
    "Is this a gallery moment, a prop, a poster, a local art cue or a visual joke?",
    "What should be credited before it goes public?"
  ]),
  scene("games-table", "Games Table", "Play", "Can this system be made small enough to play, test or simulate?", "Keep game language away from gambling, money hype or policy oversimplification.", [
    "Could this problem become a little game or tabletop test?",
    "What are the pieces, turns, rules or unfair starting positions?",
    "What does play reveal that argument misses?"
  ]),
  scene("dogs-and-aliens", "Dogs And Aliens", "Odd skies", "Sci-fi creatures, UAP headlines, space news and intergalactic dog-ally jokes.", "Current-event or public-claim items can use a source check before recording.", [
    "Which species, culture, story or headline is in the bowl today?",
    "Could dogs and humans share space with them without everyone losing the plot?",
    "What manners, smells, doors or treaty problems would show up first?"
  ]),
  scene("science-sniff-test", "Science Sniff Test", "Evidence", "Claim, evidence, uncertainty and source trail.", "Primary research, official reports or credible science reporting are useful here.", [
    "What is the claim?",
    "What does the evidence actually say?",
    "Where is the honest uncertainty?"
  ]),
  scene("life-hack", "Life Hack", "Useful", "What is one practical tip in words we understand?", "Avoid medical, legal or financial advice unless it is general and sourced.", [
    "What tiny habit might make life easier?",
    "Can a normal person try it without needing a course, gadget or lecture?",
    "Where does useful advice become overclaim?"
  ]),
  scene("onboarding", "Onboarding", "Front door", "What does a listener, guest or ally need to know to enter without feeling silly?", "Keep the doorway short. Do not explain the whole backend on air.", [
    "What would help someone join the yarn without a long preamble?",
    "What can wait until later?",
    "What phrase makes the door feel open rather than managed?"
  ]),
  scene("merch-table", "Merch Table", "Support", "Would this product, support bundle or joke object be funny, useful or just clutter?", "Keep support language grounded and avoid guilt-jar energy.", [
    "Would this be useful, funny, wearable, collectible or just noise?",
    "What would make it feel like part of the show world?",
    "How can support stay light and voluntary?"
  ]),
  scene("dogs-and-allies", "Dogs And Allies", "Community", "Who helped, what did they actually do, and what door did it open?", "Ask before naming people or attributing motives.", [
    "Who helped, showed up, shared something or made the day easier?",
    "What actually happened, without turning it into a trophy speech?",
    "Is there a thanks, callback or future invitation here?"
  ])
];

const alienSourceLanes = [
  "Sci-fi book",
  "Sci-fi film",
  "Sci-fi TV",
  "UAP disclosure headline",
  "Space news",
  "Custom possibility"
];

const alienCultureOptions = [
  "Choose one",
  "Vulcans",
  "Klingons",
  "Romulans",
  "Ferengi",
  "Borg Collective",
  "Trill",
  "Bajorans",
  "Time Lords",
  "Daleks",
  "Cybermen",
  "Wookiees",
  "Ewoks",
  "Yoda's species",
  "Jawas",
  "Xenomorphs",
  "Yautja / Predators",
  "Heptapods",
  "Na'vi",
  "Minbari",
  "Narn",
  "Centauri",
  "The Culture / Minds",
  "Trisolarans / San-Ti",
  "Martians",
  "Greys",
  "Reptilians",
  "Nordics",
  "Unknown UAP operators",
  "Other / custom"
];

const allyPossibilities = [
  "Worth a yarn",
  "Likely dog allies",
  "Likely human allies",
  "Could be both",
  "Case by case",
  "Probably complicated",
  "Probably not"
];

let savedState = loadState();
let activeScene = requestedSceneId() || savedState.activeScene || recurringScenes[0].id;
if (!recurringScenes.some((item) => item.id === activeScene)) activeScene = recurringScenes[0].id;

const picker = document.getElementById("recurringScenePicker");
const form = document.getElementById("recurringForm");
const title = document.getElementById("recurringTitle");
const type = document.getElementById("recurringType");
const preview = document.getElementById("recurringPreview");
const filename = document.getElementById("recurringFilename");
const statusLine = document.getElementById("recurringStatus");
const unObservancePanel = document.getElementById("unObservancePanel");

document.getElementById("recurringDownload").addEventListener("click", downloadMarkdown);
document.getElementById("recurringCopy").addEventListener("click", copyMarkdown);
document.getElementById("recurringReset").addEventListener("click", resetActiveForm);

renderPicker();
renderForm();

function scene(id, name, lane, purpose, sourceCheck, prompts = []) {
  return { id, name, lane, purpose, sourceCheck, prompts };
}

function renderPicker() {
  picker.innerHTML = "";
  recurringScenes.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = item.id === activeScene ? "active" : "";
    button.dataset.scene = item.id;
    button.setAttribute("aria-pressed", item.id === activeScene ? "true" : "false");
    button.innerHTML = `<strong>${item.name}</strong><span>${item.lane}</span>`;
    button.addEventListener("click", () => {
      activeScene = item.id;
      savedState.activeScene = activeScene;
      persistState();
      updateSceneUrl(item.id);
      renderPicker();
      renderForm();
    });
    picker.appendChild(button);
  });
}

function renderForm() {
  const item = getScene(activeScene);
  const data = getData(activeScene);
  type.textContent = item.lane;
  title.textContent = item.name;
  syncUnObservancePanel();
  form.innerHTML = "";

  const fields = fieldsForScene(item);

  fields.forEach((fieldConfig) => {
    const wrapper = document.createElement("div");
    wrapper.className = fieldConfig.wide ? "field field-wide" : "field";

    const label = document.createElement("label");
    label.htmlFor = fieldConfig.id;
    label.textContent = fieldConfig.label;
    wrapper.appendChild(label);

    const input = createInput(fieldConfig, data[fieldConfig.id] || defaultValue(item, fieldConfig.id));
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

function fieldsForScene(item) {
  if (item.id === "dogs-and-aliens") {
    return [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("episodeLink", "Episode or recording link", "text", null, "Optional. Link the episode, date or recording this bit belongs inside."),
      field("alienSourceLane", "Source lane", "select", alienSourceLanes),
      field("alienCulture", "Species / culture", "select", alienCultureOptions),
      field("customAlienCulture", "Other species or culture", "text", null, "For a custom creature, civilisation, UAP claim or made-up label."),
      field("sourceReference", "Book, movie, TV, headline or source link", "textarea", null, "Title, episode, article, hearing, report, clip or note.", true),
      field("dogAllyPossibility", "Dog ally possibility", "select", allyPossibilities),
      field("humanAllyPossibility", "Human ally possibility", "select", allyPossibilities),
      field("openSocietyFit", "Open-society fit", "textarea", null, "Could dogs, humans and this culture share space without everyone losing the plot?", true),
      field("mannersAndRisks", "Manners, risks or translation problems", "textarea", null, "Treaties, smells, doors, food bowls, telepathy, bureaucracy, grooming standards, etc.", true),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note.", true),
      field("redDogSetup", "Red Dog setup", "textarea", null, "A short entry point for Luke / Red Dog.", true),
      field("sourceCheck", "Source check", "textarea", null, "Current-event or public-claim items can be checked before recording.", true),
      field("visualCue", "Visual or sound cue", "textarea", null, "One animation, prop, SFX or edit note.", true),
      field("nextMove", "Possible next move", "textarea", null, "A nearby segment, cutaway, source check or park-it note.", true)
    ];
  }

  return [
    field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
    field("episodeLink", "Episode or recording link", "text", null, "Optional. Link the episode, date or recording this bit belongs inside."),
    field("whyNow", "Why this bit now", "textarea", null, "What makes this bit useful for this yarn, this week, or this recording mood?"),
    field("sceneQuestions", "Questions worth trying", "textarea", null, "Edit these freely. They are starting sparks, not decisions.", true),
    field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
    field("redDogSetup", "Red Dog setup", "textarea", null, "What short entry point helps Luke land the bit without taking over?"),
    field("sourceCheck", "Source check", "textarea", null, "What date, name, link, claim or current detail could use a quick look?"),
    field("visualCue", "Visual or sound cue", "textarea", null, "What one animation, prop, SFX or edit cue would make the bit readable?"),
    field("nextMove", "Possible next move", "textarea", null, "Does this become a segment, micro-scene, source check, cue button, or park-it note?")
  ];
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

function field(id, label, type = "text", options = null, hint = "", wide = false) {
  return { id, label, type, options, hint, wide };
}

function defaultValue(item, id) {
  if (id === "sceneQuestions") return item.prompts.join("\n");
  if (id === "sourceCheck") return item.sourceCheck;
  if (id === "nextMove") return "Quick recurring scene, segment file, one-off cutaway, or park it.";
  return "";
}

function updateField(id, value, shouldRender = true) {
  const data = getData(activeScene);
  data[id] = value;
  savedState.forms[activeScene] = data;
  persistState();
  if (shouldRender) updatePreview();
}

function updatePreview() {
  const item = getScene(activeScene);
  const data = getData(activeScene);
  preview.value = renderMarkdown(item, data);
  filename.textContent = `recurring-scene-${dateStamp()}-${slugify(item.name)}.md`;
  statusLine.textContent = "Autosaved in this browser.";
}

function renderMarkdown(item, data) {
  if (item.id === "dogs-and-aliens") {
    return renderAlienMarkdown(item, data);
  }

  return doc([
    heading("Recurring Scene", item.name),
    meta(data),
    section("Scene Lane", item.lane),
    section("Purpose", item.purpose),
    section("Core Boundaries", sharedBoundary),
    section("Episode Or Recording Link", data.episodeLink),
    section("Why This Bit Now", data.whyNow),
    listSection("Questions Worth Trying", data.sceneQuestions || item.prompts.join("\n")),
    section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
    section("Red Dog Setup", data.redDogSetup),
    section("Guest Or Ally Boundary", "Only name people, allies, animals or nicknames after consent or guest choice."),
    section("Source Check", data.sourceCheck || item.sourceCheck),
    section("Visual Or Sound Cue", data.visualCue),
    section("Next Useful Move", data.nextMove)
  ]);
}

function renderAlienMarkdown(item, data) {
  const culture = clean(data.customAlienCulture) || clean(data.alienCulture);
  return doc([
    heading("Recurring Scene", item.name),
    meta(data),
    section("Scene Lane", item.lane),
    section("Purpose", item.purpose),
    section("Core Boundaries", sharedBoundary),
    section("Episode Or Recording Link", data.episodeLink),
    section("Source Lane", data.alienSourceLane),
    section("Species Or Culture", culture === "Choose one" ? "" : culture),
    section("Reference", data.sourceReference),
    section("Dog Ally Possibility", data.dogAllyPossibility),
    section("Human Ally Possibility", data.humanAllyPossibility),
    section("Open Society Fit", data.openSocietyFit),
    section("Manners, Risks Or Translation Problems", data.mannersAndRisks),
    section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
    section("Red Dog Setup", data.redDogSetup),
    section("Source Check", data.sourceCheck || item.sourceCheck),
    section("Visual Or Sound Cue", data.visualCue),
    section("Next Useful Move", data.nextMove)
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
  savedState.forms[activeScene] = {};
  persistState();
  renderForm();
  statusLine.textContent = "Form reset.";
}

function getScene(id) {
  return recurringScenes.find((item) => item.id === id) || recurringScenes[0];
}

function getData(id) {
  if (!savedState.forms[id]) savedState.forms[id] = {};
  return savedState.forms[id];
}

function syncUnObservancePanel() {
  if (!unObservancePanel) return;
  unObservancePanel.hidden = activeScene !== "un-world-day";
}

function requestedSceneId() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("scene");
  const fromHash = window.location.hash.replace(/^#/, "");
  return fromQuery || fromHash;
}

function updateSceneUrl(sceneId) {
  const url = new URL(window.location.href);
  url.searchParams.set("scene", sceneId);
  url.hash = "";
  window.history.replaceState({}, "", url);
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed && parsed.forms) return parsed;
  } catch (error) {
    console.warn("Could not load recurring builder state", error);
  }
  return { activeScene: recurringScenes[0].id, forms: {} };
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
    "Generated by Two Dogs recurring scene feedback form."
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
