(function () {
  const payload = window.TWO_DOGS_UN_OBSERVANCES;
  if (!payload || !Array.isArray(payload.observances)) return;

  const months = [
    "All months",
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

  document.querySelectorAll("[data-un-observance-finder]").forEach((mount) => {
    const state = {
      month: String(new Date().getMonth() + 1),
      query: ""
    };

    mount.classList.add("un-finder");
    mount.innerHTML = renderShell();

    const search = mount.querySelector("[data-un-search]");
    const month = mount.querySelector("[data-un-month]");
    const list = mount.querySelector("[data-un-list]");
    const calendar = mount.querySelector("[data-un-calendar]");
    const count = mount.querySelector("[data-un-count]");

    month.value = state.month;

    search.addEventListener("input", () => {
      state.query = search.value.trim().toLowerCase();
      render();
    });

    month.addEventListener("change", () => {
      state.month = month.value;
      render();
    });

    render();

    function render() {
      const matches = filtered(state);
      count.textContent = `${matches.length} observance${matches.length === 1 ? "" : "s"} shown`;
      calendar.innerHTML = renderCalendar(state, matches);
      list.innerHTML = matches.length ? matches.map(renderResult).join("") : `<p class="un-empty">No observances matched that search.</p>`;
    }
  });

  function renderShell() {
    return `
      <div class="un-finder-heading">
        <div>
          <p class="kicker">Official UN observances</p>
          <h2>Find a UN World Day doorway.</h2>
          <p class="un-finder-note">Snapshot from the official United Nations list. Recheck the source before recording current material.</p>
        </div>
        <a class="button" href="${payload.sourceUrl}" target="_blank" rel="noopener">Official UN list</a>
      </div>
      <div class="un-finder-controls">
        <label>
          <span>Search</span>
          <input type="search" data-un-search placeholder="Search peace, oceans, women, science..." />
        </label>
        <label>
          <span>Calendar month</span>
          <select data-un-month>${months.map((name, index) => `<option value="${index}">${name}</option>`).join("")}</select>
        </label>
      </div>
      <div class="un-finder-meta">
        <span data-un-count></span>
        <span>Snapshot: ${payload.generated} · ${payload.count} observances</span>
      </div>
      <div class="un-calendar" data-un-calendar aria-label="UN observance calendar"></div>
      <div class="un-results" data-un-list aria-label="UN observance search results"></div>
    `;
  }

  function filtered(state) {
    return payload.observances.filter((item) => {
      const monthMatches = state.month === "0" || String(item.month) === state.month;
      const queryMatches =
        !state.query ||
        [item.title, item.dateLabel, item.monthName, item.resolution].join(" ").toLowerCase().includes(state.query);
      return monthMatches && queryMatches;
    });
  }

  function renderCalendar(state, matches) {
    if (state.month === "0") {
      const byMonth = payload.observances.reduce((groups, item) => {
        groups[item.month] = groups[item.month] || [];
        groups[item.month].push(item);
        return groups;
      }, {});

      return `
        <div class="un-month-strip">
          ${months.slice(1).map((name, index) => {
            const monthNumber = index + 1;
            const total = byMonth[monthNumber]?.length || 0;
            const active = matches.some((item) => item.month === monthNumber);
            return `<span class="${active ? "has-match" : ""}"><strong>${name.slice(0, 3)}</strong>${total}</span>`;
          }).join("")}
        </div>
      `;
    }

    const monthNumber = Number(state.month);
    const daysInMonth = new Date(2024, monthNumber, 0).getDate();
    const byDay = matches.reduce((groups, item) => {
      groups[item.day] = groups[item.day] || [];
      groups[item.day].push(item);
      return groups;
    }, {});

    return `
      <div class="un-calendar-title">${months[monthNumber]}</div>
      <div class="un-calendar-grid">
        ${Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const items = byDay[day] || [];
          return `<div class="un-day ${items.length ? "has-events" : ""}">
            <span class="un-day-number">${day}</span>
            ${items.slice(0, 2).map((item) => `<a href="${item.url}" target="_blank" rel="noopener">${escapeHtml(shortTitle(item.title))}</a>`).join("")}
            ${items.length > 2 ? `<span class="un-more">+${items.length - 2} more</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    `;
  }

  function renderResult(item) {
    return `
      <article class="un-result">
        <time>${item.dateLabel}</time>
        <div>
          <a href="${item.url}" target="_blank" rel="noopener"><strong>${escapeHtml(item.title)}</strong></a>
          ${item.resolution ? `<a class="un-resolution" href="${item.resolutionUrl}" target="_blank" rel="noopener">${escapeHtml(item.resolution)}</a>` : ""}
        </div>
      </article>
    `;
  }

  function shortTitle(title) {
    return title
      .replace(/^International Day of /, "")
      .replace(/^World /, "")
      .replace(/^United Nations /, "UN ");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
