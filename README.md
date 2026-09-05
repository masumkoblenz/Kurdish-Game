# Kurdish Quiz

Kurdish Quiz is a modern, mobile-first vocabulary game for learning Kurdish (Kurmancî). A visitor receives an anonymous guest ID automatically, chooses an unlocked category, answers ten timed questions, earns coins and XP, and keeps all progress locally in the browser.

## Features

- Kurmancî interface across the complete game
- Ten vocabulary categories with coin-based unlocking
- Ten-question rounds with a 15-second timer and three lives
- Combo, speed, score, coin, XP, and level systems
- Paid 50/50 and `Dem +5` jokers
- Ten persistent achievements with coin rewards
- Profile statistics, personal highscore, and progress reset
- Mixed rounds based on unlocked categories
- 54 questions in a central TypeScript data file
- Local SVG illustrations with emoji fallbacks
- Responsive layouts for phone, tablet, and desktop

## Local Progress

No database, registration, or login is used. Player data is stored under `kurdish-quiz-player-v1` in browser `localStorage`. Clearing browser site data also clears the player profile.

## Technology

- React 19
- TanStack Start and TanStack Router
- TypeScript
- Tailwind CSS 4
- Lucide React
- Netlify TanStack Start integration

## Run Locally

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The project is configured for direct deployment to Netlify through `netlify.toml` and the Netlify TanStack Start Vite plugin.

## Content

Questions live in `src/data/questions.ts`. Each entry contains a stable ID, Kurdish word, development-only German meaning, category, emoji, optional image path, and correct answer. New questions can be added without changing the quiz component.
