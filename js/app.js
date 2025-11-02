// === Week 4: CRUD on crystals.html (uses localStorage) ===
(function () {
  const STORAGE_KEY = "ceg_crystals";

  const listEl = document.getElementById("crystalList");
  if (!listEl) return; // only run on crystals.html

  const searchEl = document.getElementById("search");
  const addBtn = document.getElementById("addBtn");
  const form = document.getElementById("crystalForm");
  const fId = document.getElementById("fId");
  const fName = document.getElementById("fName");
  const fMeaning = document.getElementById("fMeaning");
  const fCategory = document.getElementById("fCategory");
  const fImage = document.getElementById("fImage");
  const cancelEdit = document.getElementById("cancelEdit");

  // Load initial data: prefer localStorage; if empty, seed from JSON
  async function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    // Seed from data/crystals.json on first load
    const res = await fetch("data/crystals.json");
    const base = await res.json();
    save(base);
    return base;
  }
  function save(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  function nextId(arr) { return arr.length ? Math.max(...arr.map(x => +x.id || 0)) + 1 : 1; }

  let all = [];   // all crystals
  let view = [];  // filtered view

  function render(items) {
    listEl.innerHTML = items.map(c => `
      <article class="crystal card" data-id="${c.id}">
        <img src="${c.image_url || ""}" alt="${c.name}" />
        <h3>${c.name}</h3>
        <p>${c.meaning}</p>
        <small><strong>Intention:</strong> ${c.category}</small>
        <div class="controls">
          <button class="btn btn-ghost editBtn">Edit</button>
          <button class="btn btn-danger deleteBtn">Delete</button>
        </div>
      </article>
    `).join("");

    // Wire up edit/delete buttons
    listEl.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest(".crystal").dataset.id;
        startEdit(id);
      });
    });
    listEl.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest(".crystal").dataset.id;
        deleteItem(id);
      });
    });
  }

  function applyFilter() {
    const q = (searchEl.value || "").toLowerCase();
    view = all.filter(c =>
      (c.name + " " + c.meaning + " " + c.category).toLowerCase().includes(q)
    );
    render(view);
  }

  function openForm() { form.classList.remove("hidden"); fName.focus(); }
  function closeForm() { form.classList.add("hidden"); form.reset(); fId.value = ""; }

  function startAdd() {
    fId.value = "";
    fName.value = "";
    fMeaning.value = "";
    fCategory.value = "";
    fImage.value = "";
    openForm();
  }

  function startEdit(id) {
    const item = all.find(c => String(c.id) === String(id));
    if (!item) return;
    fId.value = item.id;
    fName.value = item.name;
    fMeaning.value = item.meaning;
    fCategory.value = item.category;
    fImage.value = item.image_url || "";
    openForm();
  }

  function deleteItem(id) {
    if (!confirm("Delete this crystal?")) return;
    all = all.filter(c => String(c.id) !== String(id));
    save(all);
    applyFilter();
  }

  // Handle create/update
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      id: fId.value ? Number(fId.value) : nextId(all),
      name: fName.value.trim(),
      meaning: fMeaning.value.trim(),
      category: fCategory.value.trim(),
      image_url: fImage.value.trim()
    };
    if (!payload.name || !payload.meaning || !payload.category) {
      alert("Please fill in name, meaning, and category.");
      return;
    }

    const existingIdx = all.findIndex(c => String(c.id) === String(payload.id));
    if (existingIdx >= 0) {
      all[existingIdx] = payload;               // update
    } else {
      all.push(payload);                        // create
    }
    save(all);
    closeForm();
    applyFilter(); // re-render with current search query
  });

  cancelEdit.addEventListener("click", () => closeForm());
  addBtn.addEventListener("click", () => startAdd());
  searchEl.addEventListener("input", () => applyFilter());

  // Init
  loadData().then(data => {
    all = data;
    applyFilter();
  }).catch(() => {
    listEl.innerHTML = "<p>Could not load crystals.</p>";
  });
})();
