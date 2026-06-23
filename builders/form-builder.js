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
      field("workingTitle", "Working title", "text", null, "What would Luke and Angel call this before it becomes official?"),
      field("hook", "One-line yarn", "textarea", null, "What small doorway makes the topic feel worth a first sniff?"),
      field("whyNow", "Why this episode", "textarea", null, "Why might this belong soon rather than someday?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogAngle", "Red Dog angle", "textarea", null, "What can Luke notice, source-check, or land after Blue Dog has had a run?"),
      field("guestName", "Guest name", "text", null, "Who might enjoy joining this yarn, if anyone?"),
      field("guestChoice", "Guest-chosen animal and nickname", "textarea", null, "Only record what the guest chooses."),
      field("mainBeats", "Main beats", "textarea", null, "Obvious story, hidden story, ritual, contradiction, local example, bigger question."),
      field("sceneSeeds", "Scene seeds", "textarea", null, "What little visual moment keeps this feeling like two dogs, not a panel show?"),
      field("segmentSeeds", "Segment seeds", "textarea", null, "Could this use Good Dog, Bad Dog, News Flash, Dog Cues, Weather, Music or Aliens?"),
      field("adIdeas", "Ad or sponsor possibilities", "textarea", null, "Is there a support read, fake sponsor, merch joke or local plug that fits naturally?"),
      field("sourceRefs", "Source references", "textarea", null, "What sources are worth keeping nearby without turning the show into homework?"),
      field("nextAction", "Next useful action", "textarea", null, "What would make this easier to talk through next time?")
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
      field("sceneTitle", "Scene title", "text", null, "What would this moment be called on a storyboard card?"),
      field("linkedEpisode", "Linked episode", "text", null, "Which yarn, run sheet or loose topic does this scene sit beside?"),
      field("visualBeat", "Visual beat", "textarea", null, "Where are the dogs, what moves, and what prop or gesture carries the idea?"),
      field("conversationBeat", "Conversation beat", "textarea", null, "What line, pause or exchange moves from the gag back to a real question?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogBeat", "Red Dog beat", "textarea", null, "What short Luke / Red Dog line, look or prepared thought lands the meaning?"),
      field("guestChoice", "Guest-chosen animal and nickname", "textarea", null, "Only add this if the guest has chosen it themselves."),
      field("animationNotes", "Animation notes", "textarea", null, "South-Park-ish staging, beach table, gate, ferry, pub, cans, paws, props, timing."),
      field("soundNotes", "Sound or music notes", "textarea", null, "What cue tells the editor where the scene starts, turns or snaps back?"),
      field("sourceTrail", "Source trail", "textarea", null, "What detail might need checking before this scene leans on it?"),
      field("nextAction", "Next useful action", "textarea", null, "Sketch, park, attach to a runsheet, or turn into a reusable micro-scene?")
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
    tab: "Guest Onboarding",
    title: "Guest onboarding form",
    destination: "Save to guests/",
    prefix: "guest",
    fields: [
      field("status", "Status", "select", ["seed", "draft", "ready for review", "parked"]),
      field("guestName", "Guest or invitee name", "text", null, "Who is joining the table?"),
      field("episodeLink", "Episode or invitation link", "text", null, "Which yarn, date, invitation or rough run does this relate to?"),
      field("whyGuest", "Why this guest / why they want to join", "textarea", null, "What makes this person a good yarn ally right now?"),
      field("talkTopics", "What they might want to talk about", "textarea", null, "What could be fun to ask without trapping them in a brief?"),
      field("chosenAnimal", "Guest-chosen spirit animal", "text", null, "What animal or creature did they choose for themselves?"),
      field("chosenNickname", "Guest-chosen nickname", "text", null, "What nickname did they choose, if they want one?"),
      field("choiceReason", "Meaning in their words", "textarea", null, "What meaning do they give the choice, if they feel like saying?"),
      field("visualFeel", "Visual feel they want", "textarea", null, "What style, energy or small visual details would help them feel represented?"),
      field("avoid", "Things to avoid", "textarea", null, "What would they rather not have turned into a bit?"),
      field("publicPrivate", "Public/private notes", "textarea", null, "What is fine on mic, and what stays out of the show?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogPrep", "Red Dog prep", "textarea", null, "What can Luke quietly prepare so the guest has room to talk?"),
      field("sourceRefs", "Source references", "textarea", null, "What links, bio notes or claims might be useful to check before recording?"),
      field("nextAction", "Next useful action", "textarea", null, "Invite, ask for animal choice, send sample questions, or park for later?")
    ],
    render(data) {
      return doc([
        heading("Guest Onboarding Note", data.guestName),
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
      field("sponsorName", "Sponsor or idea name", "text", null, "Real sponsor, fake sponsor, local plug, support bundle or merch doorway?"),
      field("episodeLink", "Episode link", "text", null, "Which yarn does this read belong beside?"),
      field("fit", "Why it fits", "textarea", null, "Why would this feel like it belongs at the pub table rather than a hard sell?"),
      field("offer", "Plain-English offer", "textarea", null, "What is actually being offered, in normal words?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogRead", "Red Dog read", "textarea", null, "What can Luke say without sounding like an ad robot?"),
      field("scenePossibility", "Scene possibility", "textarea", null, "Could this become a can crack, shop counter, fake sponsor, ferry read or dog-world sketch?"),
      field("claimsToAvoid", "Claims or wording to avoid", "textarea", null, "What needs checking, softening, or leaving out?"),
      field("nextAction", "Next useful action", "textarea", null, "Ask, mock it up, attach to a runsheet, or keep as a joke?")
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
      field("segmentName", "Segment name", "text", null, "What would the dogs call this recurring bit?"),
      field("purpose", "Purpose", "textarea", null, "What job does it do: reset, proof, laugh, warning, win, bridge, source check, or open gate?"),
      field("format", "Format", "textarea", null, "How does it open, how long might it run, and how does it get out?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogRole", "Red Dog role", "textarea", null, "Where does Luke enter: source check, landing line, callback, practical meaning, or quiet side-eye?"),
      field("guestRole", "Guest role", "textarea", null, "Only include animal/nickname details if the guest has chosen them."),
      field("exampleUses", "Example uses", "textarea", null, "What topics would this bit rescue, sharpen or make stranger?"),
      field("sourceRefs", "Source references", "textarea", null, "What kinds of sources, dates or links would this bit usually need?")
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
      field("sourceTitle", "Source title", "text", null, "What would Luke call this source in a working note?"),
      field("sourcePath", "Source path or URL", "text", null, "Paste the link or local path that someone can actually open."),
      field("visibility", "Public / private / mixed", "select", ["mixed", "private", "public"]),
      field("whyMatters", "Why it matters", "textarea", null, "What question does this source help keep honest?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogUse", "Red Dog use", "textarea", null, "What can Luke say in one clear line before the yarn keeps moving?"),
      field("usefulFor", "Useful for", "textarea", null, "Episode, show bit, Dog News, Good Dog, Bad Dog, background, or source check?"),
      field("plainTakeaway", "Plain-English takeaway", "textarea", null, "If this became one sentence on air, what might it be?"),
      field("notOverclaim", "What not to overclaim", "textarea", null, "Where does the source stop?"),
      field("deeperReading", "Deeper reading needed", "textarea", null, "What would be worth checking before anyone leans on it?")
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
      field("handoffTitle", "Handoff title", "text", null, "What should the next helper recognise at a glance?"),
      field("task", "Exact task", "textarea", null, "What small job can another helper do without guessing the vibe?"),
      field("angelSuppliedBlueDog", "Blue Dog space", "textarea", null, "Angel-directed. Leave blank unless Angel supplies the note."),
      field("redDogContext", "Red Dog context", "textarea", null, "What is Luke trying to keep intact: tone, source trail, design, nav, rhythm, or draft shape?"),
      field("workFrom", "File to work from", "textarea", null, "Which exact files, pages or drafts are the starting point?"),
      field("allowedSources", "Allowed sources", "textarea", null, "Which source paths, repos or URLs are fair game?"),
      field("doNotTouch", "What not to touch", "textarea", null, "What would create a mess if changed?"),
      field("output", "Expected output", "textarea", null, "What would be useful to receive back: patch, list, Markdown, page, notes, or archive?"),
      field("nextAction", "Next useful action", "textarea", null, "What will Luke or Angel probably want to do after this?")
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
  { key: "runsheet", href: "runsheet.html", label: "Runsheet", note: "Full show plan and showrunner preview" },
  { key: "episode", href: "episode.html", label: "Episode", note: "Episode plans and rough arcs" },
  { key: "scene", href: "scene.html", label: "Scene", note: "Animated visual beats" },
  { key: "micro", href: "micro-scenes.html", label: "Micro Scenes", note: "Tiny cutaway pipelines" },
  { key: "guest", href: "guest.html", label: "Guest Onboarding", note: "Apply or invite without choosing their animal" },
  { key: "ad", href: "ad-sponsor.html", label: "Ad/Sponsor", note: "Sponsor fit and ad reads" },
  { key: "segment", href: "segment.html", label: "Segment", note: "Recurring show bits" },
  { key: "recurring", href: "recurring-scenes.html", label: "Recurring Builder", note: "Strategic show-bit forms" },
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
  note.innerHTML = "<strong>Boundaries stay on.</strong><br />Angel is Blue Dog. Guests choose their own spirit animal and nickname.";
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
      parsed.activeForm = parsed.activeForm || "episode";
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
