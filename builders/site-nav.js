(function () {
  const BUILDER_LINKS = [
    { path: "builders/index.html", label: "Builder Home", section: "Markdown builders", summary: "Choose a planning form and export Markdown." },
    { path: "builders/runsheet.html", label: "Runsheet Builder", section: "Markdown builders", summary: "Shape a loose show flow from prepared beats." },
    { path: "builders/episode.html", label: "Episode Builder", section: "Markdown builders", summary: "Sketch a possible main yarn or topic lane." },
    { path: "builders/scene.html", label: "Scene Builder", section: "Markdown builders", summary: "Capture visual beats, cutaways and animated moments." },
    { path: "builders/micro-scenes.html", label: "Micro Scenes", section: "Markdown builders", summary: "Tiny recurring cutaways, interruptions and dog logic." },
    { path: "builders/recurring-scenes.html", label: "Show Bit Builder", section: "Markdown builders", summary: "Build standing segments such as Good Dog, Bad Dog and News Flash." },
    { path: "builders/guest.html", label: "Guest Onboarding", section: "Markdown builders", summary: "Help guests prepare without choosing their animal for them." },
    { path: "builders/ad-sponsor.html", label: "Ad / Sponsor", section: "Markdown builders", summary: "Draft playful sponsor, fake sponsor or support reads." },
    { path: "builders/segment.html", label: "Segment Builder", section: "Markdown builders", summary: "Shape short reusable pieces inside longer conversations." },
    { path: "builders/source-reference.html", label: "Source Trail", section: "Markdown builders", summary: "Save references and source checks without overloading the show." },
    { path: "builders/handoff.html", label: "Agent Handoff", section: "Markdown builders", summary: "Leave a concise note for the next helper." }
  ];

  const MAIN_FLOW = [
    { path: "index.html", label: "Home", section: "Start here", summary: "The planning bench for the show world." },
    { path: "recurring-scenes.html", label: "Show Rhythm", section: "Show rhythm", summary: "The standing bits, recurring scenes and reusable show energy." },
    { path: "dog-news.html", label: "Dog News", section: "Show rhythm", summary: "Weekly dog-related headlines." },
    { path: "famous-dogs.html", label: "Famous Dogs", section: "Famous dogs", summary: "Grounded dog references for segues, callbacks and little moments." },
    { path: "dog-rituals.html", label: "Dog Rituals", section: "Dog rituals", summary: "Habits, observations and animal logic to compare with human rituals." },
    { path: "recording-tools/index.html", label: "Recording", section: "Recording", summary: "The live cockpit for timing, cues, notes and export." },
    { path: "builders/index.html", label: "Builders", section: "Markdown builders", summary: "Forms that turn ideas into portable Markdown." },
    { path: "site-map.html", label: "Site Map", section: "Start here", summary: "Every public planning page in one place." },
    { href: "https://auraofintelligence.github.io/strange-but-true/film-club-world.html", label: "Film Club", section: "External bridge", summary: "Back to the Strange But True film club world." }
  ];

  const NEWS_ARCHIVE_LINK = { path: "dog-news-archive.html", label: "News Archive", section: "Show rhythm", summary: "Search past dog headline runs." };

  const SITE_FLOW = [
    ...MAIN_FLOW
      .filter((item) => item.label !== "Builders" && item.label !== "Film Club")
      .flatMap((item) => item.label === "Dog News" ? [item, NEWS_ARCHIVE_LINK] : [item]),
    ...BUILDER_LINKS,
    MAIN_FLOW.find((item) => item.label === "Film Club")
  ];

  const BUILDERS = BUILDER_LINKS.filter((item) => item.path !== "builders/index.html");
  window.TWO_DOGS_SITE_FLOW = SITE_FLOW;

  function normalisePath(path) {
    return (path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  }

  function depthPrefix(currentPath) {
    const normalised = normalisePath(currentPath || window.location.pathname);
    const parts = normalised.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    const depth = Math.max(0, parts.length - (last.includes(".") ? 1 : 0));
    return "../".repeat(depth);
  }

  function hrefFor(item, prefix) {
    if (item.href) return item.href;
    return `${prefix}${item.path}`;
  }

  function currentRelativePath() {
    const pathname = normalisePath(window.location.pathname);
    const marker = "two-dogs-podcast-backend/";
    if (pathname.includes(marker)) return pathname.split(marker).pop() || "index.html";
    if (pathname.includes("/")) {
      const parts = pathname.split("/").filter(Boolean);
      return parts.slice(Math.max(0, parts.length - 2)).join("/") || "index.html";
    }
    return pathname || "index.html";
  }

  function isActive(item, current) {
    if (!item.path) return false;
    const itemPath = normalisePath(item.path);
    const currentPath = normalisePath(current);
    if (itemPath === currentPath) return true;
    return itemPath.endsWith("/index.html") && currentPath === itemPath.replace(/\/index\.html$/, "");
  }

  function createMobileSelect(items, prefix, current) {
    const select = document.createElement("select");
    select.className = "site-nav-select";
    select.setAttribute("aria-label", "Site navigation");

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = hrefFor(item, prefix);
      option.textContent = item.label;
      if (isActive(item, current)) option.selected = true;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      if (select.value.startsWith("http")) {
        window.location.href = select.value;
      } else {
        window.location.href = select.value;
      }
    });
    return select;
  }

  function renderMainNav() {
    const navs = document.querySelectorAll(".site-nav");
    if (!navs.length) return;
    const prefix = depthPrefix(currentRelativePath());
    const current = currentRelativePath();

    navs.forEach((nav) => {
      nav.innerHTML = "";
      nav.appendChild(createMobileSelect(MAIN_FLOW, prefix, current));

      const list = document.createElement("div");
      list.className = "site-nav-links";

      MAIN_FLOW.forEach((item) => {
        const link = document.createElement("a");
        link.href = hrefFor(item, prefix);
        link.textContent = item.label;
        if (isActive(item, current)) link.className = "active";
        if (item.href) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        list.appendChild(link);
      });

      nav.appendChild(list);
    });
  }

  function renderBuilderMenus() {
    const selects = document.querySelectorAll("[data-builder-select]");
    if (!selects.length) return;
    const prefix = depthPrefix(currentRelativePath());
    const current = currentRelativePath();

    selects.forEach((select) => {
      select.innerHTML = "";
      BUILDER_LINKS.forEach((item) => {
        const option = document.createElement("option");
        option.value = hrefFor(item, prefix);
        option.textContent = item.label;
        if (isActive(item, current)) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener("change", () => {
        window.location.href = select.value;
      });
    });
  }

  function renderFooterFlow() {
    const footer = document.querySelector("[data-site-flow-footer]");
    if (!footer) return;
    const current = currentRelativePath();
    if (normalisePath(current).startsWith("recording-tools/")) {
      footer.remove();
      return;
    }
    const prefix = depthPrefix(current);
    const publicFlow = SITE_FLOW.filter((item) => item.path || item.href);
    const currentIndex = publicFlow.findIndex((item) => isActive(item, current));
    const prev = currentIndex > 0 ? publicFlow[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex < publicFlow.length - 1 ? publicFlow[currentIndex + 1] : null;

    footer.innerHTML = `
      <div class="flow-footer-inner">
        ${prev ? `<a class="flow-button" href="${hrefFor(prev, prefix)}"><span>Previous</span><strong>${prev.label}</strong></a>` : "<span></span>"}
        <a class="flow-button flow-map" href="${prefix}site-map.html"><span>Full Map</span><strong>Site Map</strong></a>
        ${next ? `<a class="flow-button" href="${hrefFor(next, prefix)}"><span>Next</span><strong>${next.label}</strong></a>` : "<span></span>"}
      </div>
    `;
  }

  function renderSiteMap() {
    const mount = document.querySelector("[data-site-map]");
    if (!mount) return;
    const prefix = depthPrefix(currentRelativePath());
    const groups = SITE_FLOW.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});

    mount.innerHTML = Object.entries(groups).map(([section, items]) => `
      <section class="directory-card">
        <p class="eyebrow">${section}</p>
        <div class="directory-list">
          ${items.map((item) => `
            <a href="${hrefFor(item, prefix)}" ${item.href ? 'target="_blank" rel="noopener"' : ""}>
              <strong>${item.label}</strong>
              <span>${item.summary || ""}</span>
            </a>
          `).join("")}
        </div>
      </section>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderMainNav();
    renderBuilderMenus();
    renderFooterFlow();
    renderSiteMap();
  });
})();
