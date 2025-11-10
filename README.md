# Crystal Energy Guide

## Project Description
The Crystal Energy Guide is a web-based application that allows users to browse, add, edit, and delete crystal records using local storage. It demonstrates front-end CRUD operations, data persistence, input validation, and user interface design.

## Features
- View a catalog of 12+ crystals with names, meanings, and intentions.
- Add new crystals with image URLs.
- Edit and delete existing crystal entries.
- Real-time search filtering.
- Responsive, clean, and modern layout.

## Security Measures Beyond Password Complexity
- Added a strict Content Security Policy (CSP) meta tag to restrict resource loading.
- Escaped all dynamic text to prevent XSS attacks.
- Used HTML5 validation to enforce proper input and block incomplete data.
- No third-party scripts or inline JavaScript used.
- All assets loaded locally via HTTPS-safe paths.

## Cosmetic Enhancements
- Modern grid card layout with soft shadows and accent colors.
- Dialog-based add/edit form with validation.
- Responsive design for mobile and desktop.
- Search bar styling and consistent color palette.

## Data
The main dataset is stored in `/data/crystals.json`, containing 12 crystal records. Local storage is used to save updates.

## How to Run
1. Download or clone the repository.
2. Open `index.html` in your browser.
3. The app will load automatically and display the default crystal records.

## Skills Demonstrated
- HTML5, CSS3, and JavaScript (ES6)
- Data persistence with localStorage
- Secure coding practices (CSP, validation, escaping)
- UI/UX design principles
- Version control with Git and GitHub

## Link to Project
[Crystal Energy Guide Repository]https://cynsos1.github.io/Crystal-project/
