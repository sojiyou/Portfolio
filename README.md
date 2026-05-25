<<<<<<< HEAD
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

- **Projects** → edit the `projects` array in `src/App.js`
- **Skills** → edit the `skills` array in `src/App.js`
- **Contact form** → replace the `setTimeout` mock in `handleSubmit` with your real API (EmailJS, Formspree, etc.)
- **Colors** → edit CSS variables in `src/index.css`

## Adding Real Email (Formspree)
1. Sign up at https://formspree.io
2. Create a form, get your endpoint URL
3. In `App.js`, replace the `handleSubmit` function with:

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('sending');
  await fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  setStatus('sent');
};
```
=======
# Portfolio
My personal website portfolio
>>>>>>> 1691d8cdc7b113b9a2c752e0212f935bf6fcffab
