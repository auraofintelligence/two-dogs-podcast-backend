const STORE_KEY = "two-dogs-markdown-builder-v1";

const sharedBoundary = [
  "- Angel is Blue Dog / Blue Heeler.",
  "- Blue Dog material is Angel-directed only.",
  "- Luke is Red Dog / Red Heeler.",
  "- Guests choose their own spirit animal character and nickname."
].join("\n");

const forms = {
  episode: {
    tab: "Episode",
    title: "Episode feedback form",
    destination: "Save to episodes/",
    prefix: "episode",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("workingTitle", "Working title"),
      field("hook", "One-line yarn", "textarea"),
      field("whyNow", "Why this episode", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogAngle", "Red Dog angle", "textarea", null, "What can Luke / Red Dog bring from lived context, humour or deeper datasets?"),
      field("guestName", "Guest name"),
      field("guestChoice", "Guest-chosen animal and nickname", "textarea", null, "Only record what the guest chooses."),
      field("mainBeats", "Main beats", "textarea", null, "One per line is fine."),
      field("sceneSeeds", "Scene seeds", "textarea"),
      field("segmentSeeds", "Segment seeds", "textarea"),
      field("adIdeas", "Ad or sponsor possibilities", "textarea"),
      field("sourceRefs", "Source references", "textarea"),
      field("nextAction", "Next useful action", "textarea")
    ],
    render(data) {
      return doc([
        heading("Episode", data.workingTitle),
        meta(data),
        section("Core Boundaries", sharedBoundary),
        section("Hook", data.hook),
        section("Why This Episode", data.whyNow),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Angle", data.redDogAngle),
        section("Guest", guestBlock(data)),
        listSection("Main Beats", data.mainBeats),
        listSection("Scene Seeds", data.sceneSeeds),
        listSection("Segment Seeds", data.segmentSeeds),
        listSection("Ad Or Sponsor Possibilities", data.adIdeas),
        listSection("Source References", data.sourceRefs),
        section("Next Useful Action", data.nextAction)
      ]);
    }
  },
  scene: {
    tab: "Scene",
    title: "Scene feedback form",
    destination: "Save to scenes/",
    prefix: "scene",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("sceneTitle", "Scene title"),
      field("linkedEpisode", "Linked episode"),
      field("visualBeat", "Visual beat", "textarea"),
      field("conversationBeat", "Conversation beat", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogBeat", "Red Dog beat", "textarea"),
      field("guestChoice", "Guest-chosen animal and nickname", "textarea"),
      field("animationNotes", "Animation notes", "textarea"),
      field("soundNotes", "Sound or music notes", "textarea"),
      field("sourceTrail", "Source trail", "textarea"),
      field("nextAction", "Next useful action", "textarea")
    ],
    render(data) {
      return doc([
        heading("Scene", data.sceneTitle),
        meta(data),
        section("Linked Episode", data.linkedEpisode),
        section("Core Boundaries", sharedBoundary),
        section("Visual Beat", data.visualBeat),
        section("Conversation Beat", data.conversationBeat),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Beat", data.redDogBeat),
        section("Guest Character", guestChoice(data.guestChoice)),
        listSection("Animation Notes", data.animationNotes),
        listSection("Sound Or Music Notes", data.soundNotes),
        listSection("Source Trail", data.sourceTrail),
        section("Next Useful Action", data.nextAction)
      ]);
    }
  },
  guest: {
    tab: "Guest",
    title: "Guest feedback form",
    destination: "Save to guests/",
    prefix: "guest",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("guestName", "Guest name"),
      field("episodeLink", "Episode link"),
      field("whyGuest", "Why this guest", "textarea"),
      field("talkTopics", "What they might want to talk about", "textarea"),
      field("chosenAnimal", "Guest-chosen spirit animal"),
      field("chosenNickname", "Guest-chosen nickname"),
      field("choiceReason", "Meaning in their words", "textarea"),
      field("visualFeel", "Visual feel they want", "textarea"),
      field("avoid", "Things to avoid", "textarea"),
      field("publicPrivate", "Public/private notes", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogPrep", "Red Dog prep", "textarea"),
      field("sourceRefs", "Source references", "textarea"),
      field("nextAction", "Next useful action", "textarea")
    ],
    render(data) {
      return doc([
        heading("Guest Note", data.guestName),
        meta(data),
        section("Episode Link", data.episodeLink),
        section("Core Boundaries", sharedBoundary),
        section("Why This Guest", data.whyGuest),
        section("Talk Topics", data.talkTopics),
        section("Guest-Chosen Spirit Animal", [
          line("Chosen animal", data.chosenAnimal),
          line("Chosen nickname", data.chosenNickname),
          line("Meaning in their words", data.choiceReason),
          line("Visual feel they want", data.visualFeel),
          line("Things to avoid", data.avoid)
        ].filter(Boolean).join("\n\n")),
        section("Consent And Boundaries", data.publicPrivate),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Prep", data.redDogPrep),
        listSection("Source References", data.sourceRefs),
        section("Next Useful Action", data.nextAction)
      ]);
    }
  },
  ad: {
    tab: "Ad/Sponsor",
    title: "Ad and sponsor feedback form",
    destination: "Save to ads-sponsors/",
    prefix: "ad-sponsor",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("sponsorName", "Sponsor or idea name"),
      field("episodeLink", "Episode link"),
      field("fit", "Why it fits", "textarea"),
      field("offer", "Plain-English offer", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogRead", "Red Dog read", "textarea"),
      field("scenePossibility", "Scene possibility", "textarea"),
      field("claimsToAvoid", "Claims or wording to avoid", "textarea"),
      field("nextAction", "Next useful action", "textarea")
    ],
    render(data) {
      return doc([
        heading("Ad Or Sponsor Idea", data.sponsorName),
        meta(data),
        section("Episode Link", data.episodeLink),
        section("Fit", data.fit),
        section("Plain-English Offer", data.offer),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Read", data.redDogRead),
        section("Scene Possibility", data.scenePossibility),
        section("Boundaries", data.claimsToAvoid),
        section("Next Useful Action", data.nextAction)
      ]);
    }
  },
  segment: {
    tab: "Segment",
    title: "Recurring segment feedback form",
    destination: "Save to segments/",
    prefix: "segment",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("segmentName", "Segment name"),
      field("purpose", "Purpose", "textarea"),
      field("format", "Format", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogRole", "Red Dog role", "textarea"),
      field("guestRole", "Guest role", "textarea", null, "Only include animal/nickname details if the guest has chosen them."),
      field("exampleUses", "Example uses", "textarea"),
      field("sourceRefs", "Source references", "textarea")
    ],
    render(data) {
      return doc([
        heading("Segment Idea", data.segmentName),
        meta(data),
        section("Purpose", data.purpose),
        section("Format", data.format),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Role", data.redDogRole),
        section("Guest Role", data.guestRole),
        listSection("Example Uses", data.exampleUses),
        listSection("Source References", data.sourceRefs)
      ]);
    }
  },
  source: {
    tab: "Source",
    title: "Source reference feedback form",
    destination: "Save to source-references/",
    prefix: "source",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("sourceTitle", "Source title"),
      field("sourcePath", "Source path or URL"),
      field("visibility", "Public / private / mixed", "select", ["mixed", "private", "public"]),
      field("whyMatters", "Why it matters", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogUse", "Red Dog use", "textarea", null, "How Red Dog might use or explain this source."),
      field("usefulFor", "Useful for", "textarea"),
      field("plainTakeaway", "Plain-English takeaway", "textarea"),
      field("notOverclaim", "What not to overclaim", "textarea"),
      field("deeperReading", "Deeper reading needed", "textarea")
    ],
    render(data) {
      return doc([
        heading("Source Reference", data.sourceTitle),
        meta(data),
        section("Source", data.sourcePath),
        section("Visibility", data.visibility),
        section("Why It Matters", data.whyMatters),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Use", data.redDogUse),
        listSection("Useful For", data.usefulFor),
        section("Plain-English Takeaway", data.plainTakeaway),
        section("What Not To Overclaim", data.notOverclaim),
        section("Deeper Reading Needed", data.deeperReading)
      ]);
    }
  },
  handoff: {
    tab: "Handoff",
    title: "Agent handoff feedback form",
    destination: "Save to handoffs/",
    prefix: "handoff",
    fields: [
      field("status", "Status", "select", ["seed", "ready", "done", "parked"]),
      field("handoffTitle", "Handoff title"),
      field("task", "Exact task", "textarea"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogContext", "Red Dog context", "textarea", null, "What Red Dog is trying to get done or keep intact."),
      field("workFrom", "File to work from", "textarea"),
      field("allowedSources", "Allowed sources", "textarea"),
      field("doNotTouch", "What not to touch", "textarea"),
      field("output", "Expected output", "textarea"),
      field("nextAction", "Next useful action", "textarea")
    ],
    render(data) {
      return doc([
        heading("Handoff", data.handoffTitle),
        meta(data),
        section("Task", data.task),
        section("Blue Dog Space", blueDog(data.angelSuppliedBlueDog)),
        section("Red Dog Context", data.redDogContext),
        section("Work From", data.workFrom),
        listSection("Allowed Sources", data.allowedSources),
        listSection("Do Not Touch", data.doNotTouch),
        section("Expected Output", data.output),
        section("Next Useful Action", data.nextAction)
      ]);
    }
  }
};

const builderPages = [
  { key: "episode", href: "episode.html", label: "Episode", note: "Episode plans and rough arcs" },
  { key: "scene", href: "scene.html", label: "Scene", note: "Animated visual beats" },
  { key: "micro", href: "micro-scenes.html", label: "Micro Scenes", note: "Tiny cutaway pipelines" },
  { key: "guest", href: "guest.html", label: "Guest", note: "Guest prep and chosen character notes" },
  { key: "ad", href: "ad-sponsor.html", label: "Ad/Sponsor", note: "Sponsor fit and ad reads" },
  { key: "segment", href: "segment.html", label: "Segment", note: "Recurring show bits" },
  { key: "recurring", href: "recurring-scenes.html", label: "Recurring Scenes", note: "Strategic mini-forms" },
  { key: "source", href: "source-reference.html", label: "Source", note: "Source trails and context" },
  { key: "handoff", href: "handoff.html", label: "Handoff", note: "Small agent task packets" }
];

window.twoDogsBuilder = { forms, builderPages };

let savedState = loadState();
let activeForm = document.body.dataset.builder || savedState.activeForm || "episode";
if (!forms[activeForm]) activeForm = "episode";
savedState.activeForm = activeForm;
persistState();

const formElement = document.getElementById("builderForm");
const formType = document.getElementById("formType");
const formTitle = document.getElementById("formTitle");
const destination = document.getElementById("destination");
const filenameElement = document.getElementById("filename");
const preview = document.getElementById("markdownPreview");
const statusLine = document.getElementById("statusLine");

buildSideNav();
renderActiveForm();

document.getElementById("downloadButton").addEventListener("click", downloadMarkdown);
document.getElementById("copyButton").addEventListener("click", copyMarkdown);
document.getElementById("clearButton").addEventListener("click", clearActiveForm);

function field(id, label, type = "text", options = null, hint = "") {
  return { id, label, type, options, hint };
}

function buildSideNav() {
  const sideNav = document.querySelector(".side-nav");
  if (!sideNav) return;
  sideNav.innerHTML = "";

  const title = document.createElement("p");
  title.className = "side-nav-title";
  title.textContent = "Builder pages";
  sideNav.appendChild(title);

  builderPages.forEach((page) => {
    const link = document.createElement("a");
    link.href = page.href;
    link.className = page.key === activeForm ? "active" : "";
    link.innerHTML = `<strong>${page.label}</strong><span>${page.note}</span>`;
    sideNav.appendChild(link);
  });

  const note = document.createElement("div");
  note.className = "side-note";
  note.innerHTML = "<strong>Boundaries stay on.</strong><br />Blue Dog is Angel-directed. Guests choose their own spirit animal and nickname.";
  sideNav.appendChild(note);
}

function renderActiveForm() {
  const config = forms[activeForm];
  const data = getFormState(activeForm);
  formType.textContent = config.tab;
  formTitle.textContent = config.title;
  destination.textContent = config.destination;
  formElement.innerHTML = "";

  config.fields.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.textContent = item.label;
    wrapper.appendChild(label);

    const input = createInput(item, data[item.id] || "");
    input.addEventListener("input", () => updateField(item.id, input.value));
    input.addEventListener("change", () => updateField(item.id, input.value));
    wrapper.appendChild(input);

    if (item.hint) {
      const hint = document.createElement("p");
      hint.className = "hint";
      hint.textContent = item.hint;
      wrapper.appendChild(hint);
    }

    formElement.appendChild(wrapper);
  });

  updatePreview();
}

function createInput(item, value) {
  if (item.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.id = item.id;
    textarea.value = value;
    return textarea;
  }

  if (item.type === "select") {
    const select = document.createElement("select");
    select.id = item.id;
    item.options.forEach((option) => {
      const node = document.createElement("option");
      node.value = option;
      node.textContent = option;
      select.appendChild(node);
    });
    select.value = value || item.options[0];
    updateField(item.id, select.value, false);
    return select;
  }

  const input = document.createElement("input");
  input.id = item.id;
  input.type = "text";
  input.value = value;
  return input;
}

function updateField(id, value, shouldRender = true) {
  const data = getFormState(activeForm);
  data[id] = value;
  savedState.forms[activeForm] = data;
  persistState();
  if (shouldRender) updatePreview();
}

function updatePreview() {
  const data = getFormState(activeForm);
  const markdown = forms[activeForm].render(data);
  preview.value = markdown;
  filenameElement.textContent = filenameFor(activeForm, data);
  statusLine.textContent = "Autosaved in this browser.";
}

function downloadMarkdown() {
  const markdown = preview.value;
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filenameElement.textContent;
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

function clearActiveForm() {
  savedState.forms[activeForm] = {};
  persistState();
  renderActiveForm();
  statusLine.textContent = "Form reset.";
}

function getFormState(key) {
  if (!savedState.forms[key]) savedState.forms[key] = {};
  return savedState.forms[key];
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed && parsed.forms) {
      activeForm = parsed.activeForm || "episode";
      return parsed;
    }
  } catch (error) {
    console.warn("Could not load builder state", error);
  }
  return { activeForm: "episode", forms: {} };
}

function persistState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(savedState));
}

function doc(parts) {
  return parts.filter(Boolean).join("\n\n").trim() + "\n";
}

function heading(type, title) {
  return `# ${type}${title ? ` - ${title}` : ""}`;
}

function meta(data) {
  return [
    line("Status", data.status || "seed"),
    line("Generated", new Date().toISOString().slice(0, 10)),
    "Generated by Two Dogs interactive feedback form."
  ].join("\n");
}

function section(title, value) {
  if (!clean(value)) return "";
  return `## ${title}\n\n${clean(value)}`;
}

function listSection(title, value) {
  const items = clean(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!items.length) return "";
  return `## ${title}\n\n${items.map((item) => `- ${item.replace(/^-+\s*/, "")}`).join("\n")}`;
}

function line(label, value) {
  if (!clean(value)) return "";
  return `${label}: ${clean(value)}`;
}

function clean(value) {
  return String(value || "").trim();
}

function blueDog(value) {
  if (clean(value)) {
    return `Angel-supplied note:\n\n${clean(value)}`;
  }
  return "[Blue Dog space - Angel to direct]";
}

function guestBlock(data) {
  return [
    line("Guest name", data.guestName),
    clean(data.guestChoice) ? `Guest-chosen animal and nickname:\n\n${clean(data.guestChoice)}` : ""
  ].filter(Boolean).join("\n\n");
}

function guestChoice(value) {
  if (clean(value)) return clean(value);
  return "Only fill this in after the guest has chosen their own animal and nickname.";
}

function filenameFor(key, data) {
  const config = forms[key];
  const title =
    data.workingTitle ||
    data.sceneTitle ||
    data.guestName ||
    data.sponsorName ||
    data.segmentName ||
    data.sourceTitle ||
    data.handoffTitle ||
    "draft";
  const date = new Date().toISOString().slice(0, 10);
  return `${config.prefix}-${date}-${slugify(title)}.md`;
}

function slugify(value) {
  const slug = clean(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "draft";
}
