(function () {
  const STORAGE_KEY = "ceg_crystals";

  const listEl   = document.getElementById("crystalList");
  const searchEl = document.getElementById("search");

  const addBtn   = document.getElementById("addBtn");
  const overlay  = document.getElementById("addFormOverlay");
  const closeBtn = document.getElementById("closeForm");
  const saveBtn  = document.getElementById("saveCrystal");

  if (!listEl) return;

  // ---------- Data helpers ----------
  const read = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const write = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // Seed a few crystals once (only if storage is empty)
  const seedIfEmpty = () => {
    const hasAny = read().length > 0;
    if (hasAny) return;
    write([
      {
        name: "Rose Quartz",
        meaning: "Unconditional love",
        tags: ["Love"],
        imageUrl: "images/rose-quartz.jpg"
      },
      {
        name: "Black Tourmaline",
        meaning: "Grounding & protection",
        tags: ["Protection"],
        imageUrl: "images/black-tourmaline.jpg"
      },
      {
        name: "Amethyst",
        meaning: "Calm, intuition, sleep",
        tags: ["Clarity"],
        imageUrl: "images/amethyst.jpg"
      },
      {
        name: "Citrine",
        meaning: "Abundance and joy",
        tags: ["Luck"],
        imageUrl: "images/citrine.jpg"
      }
    ]);
  };

  // ---------- Render ----------
  const cardHTML = (item) => {
    const tags = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
    const photoStyle = item.imageUrl
      ? `style="background-image:url('${item.imageUrl}')"` 
      : `style="display:flex;align-items:center;justify-content:center;color:#9aa0af;font-size:14px;">No image`;

    return `
      <article class="card" data-name="${(item.name||"").replace(/"/g,'&quot;')}">
        <div class="photo" ${item.imageUrl ? photoStyle : ''}>${item.imageUrl ? '' : 'No image'}</div>
        <div class="body">
          <h3>${item.name || "Untitled"}</h3>
          <p>${item.meaning || ""}</p>
          <div class="tags">${tags}</div>
          <div class="actions">
            <button class="btn-edit" type="button">Edit</button>
            <button class="btn-del" type="button">Delete</button>
          </div>
        </div>
      </article>
    `;
  };

  const render = (items) => {
    listEl.innerHTML = items.map(cardHTML).join("");
  };

  // ---------- Search ----------
  const applyFilter = () => {
    const q = (searchEl?.value || "").toLowerCase();
    const items = read().filter(x =>
      (x.name || "").toLowerCase().includes(q) ||
      (x.meaning || "").toLowerCase().includes(q) ||
      (x.tags || []).some(t => t.toLowerCase().includes(q))
    );
    render(items);
  };

  // ---------- Delete (and future edit) ----------
  listEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const name = card.dataset.name;

    if (e.target.classList.contains("btn-del")) {
      const next = read().filter(x => x.name !== name);
      write(next);
      render(next);
    }

    if (e.target.classList.contains("btn-edit")) {
      // Simple inline edit prompt (keep it basic for now)
      const items = read();
      const item = items.find(x => x.name === name);
      if (!item) return;

      const newName = prompt("Name:", item.name) ?? item.name;
      const newMeaning = prompt("Meaning:", item.meaning) ?? item.meaning;
      const newImage = prompt("Image URL:", item.imageUrl || "") ?? item.imageUrl;
      const newTags = prompt("Tags (comma separated):", (item.tags || []).join(", ")) ?? (item.tags || []).join(", ");

      item.name = newName.trim() || item.name;
      item.meaning = newMeaning.trim() || item.meaning;
      item.imageUrl = newImage.trim();
      item.tags = newTags.split(",").map(t => t.trim()).filter(Boolean);

      write(items);
      applyFilter();
    }
  });

  // ---------- Add form ----------
  if (addBtn && overlay && closeBtn && saveBtn) {
    addBtn.onclick = () => (overlay.style.display = "block");
    closeBtn.onclick = () => (overlay.style.display = "none");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });

    saveBtn.onclick = () => {
      const name    = document.getElementById("crystalName").value.trim();
      const meaning = document.getElementById("crystalMeaning").value.trim();
      const imageUrl = document.getElementById("crystalImage").value.trim();
      const tags = document.getElementById("crystalTags").value
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      if (!name || !meaning) {
        alert("Please enter a name and meaning.");
        return;
      }

      const items = read();
      items.push({ name, meaning, imageUrl, tags });
      write(items);

      // reset + close + refresh list
      document.getElementById("crystalName").value = "";
      document.getElementById("crystalMeaning").value = "";
      document.getElementById("crystalImage").value = "";
      document.getElementById("crystalTags").value = "";
      overlay.style.display = "none";
      applyFilter();
    };
  }

  // Init
  seedIfEmpty();
  render(read());
  if (searchEl) searchEl.addEventListener("input", applyFilter);
})();
