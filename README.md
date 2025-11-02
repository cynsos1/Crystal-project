# Crystal Energy Guide (Starter)

This is a simple starter for your class deliverables.

## Pages (5+)
- `index.html` (Home)
- `crystals.html` (Crystals listing + search)
- `about.html`
- `contact.html`
- `login.html` (Demo login using localStorage)

## How to run
Open `index.html` in your browser. For local JSON fetch to work reliably, use a simple local server:
- Python: `python -m http.server 8000` then visit http://localhost:8000

## Deploying
1. Create a GitHub repo and push these files.
2. Enable GitHub Pages (Settings → Pages → Deploy from branch → `main` → `/root`).
3. Share the URL in your Word document.

## Mock Database Schema
| Field | Type | Description |
|------|------|-------------|
| id | INT | Unique ID |
| name | VARCHAR(50) | Crystal name |
| meaning | VARCHAR(255) | Energy/properties |
| image_url | VARCHAR(255) | Image URL |
| category | VARCHAR(50) | Intention (e.g., Love, Protection) |
