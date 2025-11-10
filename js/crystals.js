const STORAGE_KEY = "ceg_crystals";
const listEl = document.getElementById("gridView");
const searchEl = document.getElementById("q");
const addBtn = document.getElementById("addCrystal");
const form = document.getElementById("crystalForm");
const fId = document.getElementById("fId");
const fName = document.getElementById("fName");
const fMeaning = document.getElementById("fMeaning");
const fCategory = document.getElementById("fCategory");
const fImage = document.getElementById("fImage");
const cancelEdit = document.getElementById("cancelEdit");
const editor = document.getElementById("editor");
const closeEditor = document.getElementById("closeEditor");

function openForm() { editor.showModal(); fName.focus(); }
function closeForm() { editor.close(); form.reset(); fId.value = ""; }
closeEditor.addEventListener("click", closeForm);
cancelEdit.addEventListener("click", closeForm);

function safe(t) { const s = document.createElement("span"); s.textContent = String(t ?? ""); return s.innerHTML; }
function save(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
function nextId(arr) { return arr.length ? Math.max(...arr.map(x => +x.id || 0)) + 1 : 1; }

let all = [];
let view = [];

async function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const res = await fetch("data/crystals.json");
  const base = await res.json();
  save(base);
  return base;
}

function render(items) {
  listEl.innerHTML = items.map(c => `
    <article class="card crystal" data-id="${c.id}">
      <div class="thumb">
        ${c.image_url
          ? `<img src="${safe(c.image_url)}" alt="${safe(c.name)}" style="width:100%;height:100%;object-fit:cover;">`
          : `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2 3 9l9 13 9-13-9-7Z" stroke="hsl(270 70% 50%)" stroke-width="1.5" fill="hsl(270 75% 55%/.2)"/></svg>`
        }
      </div>
      <div class="body">
        <h3 class="title">${safe(c.name)}</h3>
        <p class="subtitle">${safe(c.meaning)}</p>
        <div class="tags"><span class="tag">${safe(c.category)}</span></div>
      </div>
      <div class="actions-row">
        <div style="display:flex;gap:.5rem;">
          <button class="btn editBtn">Edit</button>
          <button class="btn deleteBtn">Delete</button>
        </div>
      </div>
    </article>
  `).join("");
  listEl.querySelectorAll(".editBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.closest(".crystal").dataset.id;
      startEdit(id);
    });
  });
  listEl.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", e => {
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

form.addEventListener("submit", e => {
  e.preventDefault();
  const payload = {
    id: fId.value ? Number(fId.value) : nextId(all),
    name: fName.value.trim(),
    meaning: fMeaning.value.trim(),
    category: fCategory.value.trim(),
    image_url: fImage.value.trim()
  };
  if (!payload.name || !payload.meaning || !payload.category) {
    alert("Please fill in all fields.");
    return;
  }
  const existingIdx = all.findIndex(c => String(c.id) === String(payload.id));
  if (existingIdx >= 0) all[existingIdx] = payload; else all.push(payload);
  save(all);
  closeForm();
  applyFilter();
});

addBtn.addEventListener("click", startAdd);
searchEl.addEventListener("input", applyFilter);

loadData().then(data => {
  all = data;
  applyFilter();
}).catch(() => {
  listEl.innerHTML = "<p>Could not load crystals.</p>";
});
