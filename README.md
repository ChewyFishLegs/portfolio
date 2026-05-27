# Alex Rivera — Personal Portfolio

A fully responsive, modern personal portfolio website built with **Vanilla HTML, CSS, and JavaScript**.

---

## 🖥 Live Demo

> Deploy to GitHub Pages and paste your URL here.

---

## ✨ Features

### Required
- **Home** — Name, avatar, short bio, animated intro
- **Projects** — 3 project cards with title, description, tech stack, and links
- **Contact** — Validated form with success alert (no email sending required)
- **Responsive** — Works on all screen sizes with CSS Grid & Flexbox
- **Smooth navigation** — Scroll-spy highlights active nav link

### Bonus
- 🌙 **Dark / Light mode toggle** — persists via `localStorage`
- 🐙 **Live GitHub repos** — fetched dynamically from the GitHub API (change username!)
- ✨ **Animations** — Canvas particle background, scroll fade-ins, hover effects, counter animation
- 🎯 **Custom cursor** — Follows mouse with spring physics
- 🚀 **Deploy-ready** — GitHub Pages compatible (pure static files)

---

## 🗂 Project Structure

```
portfolio/
├── index.html      # Main HTML (single page)
├── style.css       # All styles (CSS variables, responsive, animations)
├── script.js       # All JavaScript (theme, canvas, GitHub API, form)
└── README.md       # This file
```

---

## 🚀 Deployment

### GitHub Pages (Free)
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set Source to **Deploy from a branch → main → / (root)**
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

---

## 🔧 Customization

### Change Personal Info
Edit `index.html`:
- Update name in `<title>` and `.hero-name`
- Replace bio text in `.hero-bio`
- Change avatar URL in `<img class="avatar-img">`
- Update projects in the `#projects` section
- Update social links in the contact section

### Change GitHub Username
In `script.js`, find:
```js
fetchRepos(document.getElementById('ghUsername').value.trim());
```
Or change the default input value in `index.html`:
```html
<input ... value="your-github-username" />
```

### Change Color Accent
In `style.css`, update the CSS variables:
```css
:root {
  --accent:   #d4a853;  /* Change to your preferred color */
  --accent-2: #e8c97a;
}
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (Variables, Grid, Flexbox, Animations) |
| Scripting | Vanilla JavaScript (ES2022+) |
| Fonts | Google Fonts (Cormorant Garamond + JetBrains Mono) |
| API | GitHub REST API v3 |
| Hosting | GitHub Pages / Vercel |

---

## 📋 Requirements Checklist

- [x] HTML + CSS + JavaScript
- [x] At least 3 sections (Home, Projects, Contact)
- [x] Profile picture + name + bio
- [x] 2+ projects with title, description, tech, link
- [x] Contact form with success alert
- [x] Responsive (mobile + desktop)
- [x] Clean layout (Flexbox/Grid)
- [x] Smooth navigation
- [x] **Bonus:** Dark mode toggle (saves to localStorage)
- [x] **Bonus:** GitHub API integration
- [x] **Bonus:** Animations (canvas, scroll fade-ins, hover effects)
- [ ] **Bonus:** Deploy online ← do this step!

---

## 📄 License

MIT — feel free to use and customize for your own portfolio!
