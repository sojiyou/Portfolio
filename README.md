# Sojo Decaran — Frontend Developer Portfolio

A dark, minimal React portfolio. Built to be deployed on Vercel.

## Tech Stack
- React 18
- CSS (no frameworks — pure custom design system)
- Google Fonts: Syne + DM Sans

## Local Development

```bash
npm install
npm start
```

Opens at http://localhost:3000

## Deploy to Vercel

### Option 1 — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Done.

### Option 2 — Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Framework preset: **Create React App**
5. Click **Deploy**

Vercel auto-detects React and sets the correct build command (`npm run build`) and output directory (`build`).

## Customization

- **Projects, Skills, Experiences** → managed via the `/admin` panel backed by Firebase Firestore
- **Banner text, Contact info** → also editable from the `/admin` panel
- **Contact form** → uses EmailJS — set `REACT_APP_EMAILJS_*` in `.env`
- **Colors** → edit CSS variables in `src/index.css`
