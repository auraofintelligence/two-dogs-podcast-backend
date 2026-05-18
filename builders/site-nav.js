function enhanceBuilderMenu() {
  const siteNav = document.querySelector(".site-nav");
  if (!siteNav || siteNav.dataset.builderMenuReady === "true") return;

  const builderFiles = new Set([
    "episode.html",
    "scene.html",
    "guest.html",
    "ad-sponsor.html",
    "segment.html",
    "recurring-scenes.html",
    "source-reference.html",
    "handoff.html"
  ]);

  const links = Array.from(siteNav.querySelectorAll("a"));
  const hasBuilderLinks = links.some((link) => isBuilderLink(link.href, builderFiles));
  if (!hasBuilderLinks) return;

  const primaryLinks = [];
  const builderLinks = [];
  const currentUrl = new URL(window.location.href);

  links.forEach((link) => {
    const clone = link.cloneNode(true);
    if (isBuilderLink(link.href, builderFiles)) {
      builderLinks.push(clone);
    } else {
      primaryLinks.push(clone);
    }
  });

  const activeBuilder = builderLinks.find((link) => {
    const linkUrl = new URL(link.href, window.location.href);
    return link.classList.contains("active") || samePage(linkUrl, currentUrl);
  });

  siteNav.innerHTML = "";
  primaryLinks.forEach((link) => siteNav.appendChild(link));

  if (builderLinks.length) {
    const menu = document.createElement("details");
    menu.className = "builder-menu";

    const summary = document.createElement("summary");
    summary.textContent = activeBuilder ? `Builders: ${activeBuilder.textContent.trim()}` : "Builders";
    if (activeBuilder) summary.className = "active";

    const panel = document.createElement("div");
    panel.className = "builder-menu-panel";
    builderLinks.forEach((link) => panel.appendChild(link));

    menu.append(summary, panel);
    siteNav.appendChild(menu);

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) menu.removeAttribute("open");
    });
  }

  siteNav.dataset.builderMenuReady = "true";
}

function enhanceMobilePageMenu() {
  const siteNav = document.querySelector(".site-nav");
  if (!siteNav || document.querySelector(".mobile-page-menu")) return;

  const links = Array.from(siteNav.querySelectorAll("a"));
  if (!links.length) return;

  const wrapper = document.createElement("label");
  wrapper.className = "mobile-page-menu";

  const label = document.createElement("span");
  label.textContent = "Choose page";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Choose builder page");

  const currentUrl = new URL(window.location.href);
  let selectedIndex = 0;

  links.forEach((link, index) => {
    const option = document.createElement("option");
    const linkUrl = new URL(link.href, window.location.href);
    const linkText = link.textContent.trim();

    option.value = linkUrl.href;
    option.textContent = linkText;
    select.appendChild(option);

    if (link.classList.contains("active") || samePage(linkUrl, currentUrl)) {
      selectedIndex = index;
    }
  });

  select.selectedIndex = selectedIndex;
  select.addEventListener("change", () => {
    window.location.href = select.value;
  });

  wrapper.append(label, select);
  siteNav.after(wrapper);
  document.body.classList.add("mobile-nav-ready");
}

function normalisePath(pathname) {
  return pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "/index.html");
}

function samePage(linkUrl, currentUrl) {
  return (
    linkUrl.origin === currentUrl.origin &&
    normalisePath(linkUrl.pathname) === normalisePath(currentUrl.pathname)
  );
}

function fileName(href) {
  const url = new URL(href, window.location.href);
  return url.pathname.split("/").pop() || "index.html";
}

function isBuilderLink(href, builderFiles) {
  const url = new URL(href, window.location.href);
  return url.pathname.includes("/builders/") && builderFiles.has(fileName(href));
}

enhanceBuilderMenu();
enhanceMobilePageMenu();
