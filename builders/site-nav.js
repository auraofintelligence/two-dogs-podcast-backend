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

    const samePage =
      linkUrl.origin === currentUrl.origin &&
      normalisePath(linkUrl.pathname) === normalisePath(currentUrl.pathname);

    if (link.classList.contains("active") || samePage) {
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

enhanceMobilePageMenu();
