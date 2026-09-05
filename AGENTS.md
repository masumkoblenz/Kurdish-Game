# Kurdish Quiz Architecture

## Project Overview

Kurdish Quiz is a mobile-first Kurmancî vocabulary game built with React and TanStack Start. It runs as a client-side learning experience on Netlify and stores all player progress in the browser. There is no account system, server API, or database.

## Technology

- React 19 with TypeScript
- TanStack Start and TanStack Router
- Tailwind CSS 4 plus custom CSS
- Lucide React icons
- Netlify deployment through the TanStack Start Vite plugin
- Browser `localStorage` for guest-player persistence

## Key Directories

- `src/components/KurdishQuiz.tsx`: Main application state and all game views: home, quiz, result, profile, and achievements.
- `src/data/questions.ts`: Category metadata and the central, extensible question library. German meanings are development-only metadata and are never shown in the game.
- `src/lib/player.ts`: Player types, guest-ID creation, `localStorage` access, XP helpers, and achievement rules.
- `src/routes/`: TanStack Start routes and document metadata.
- `src/styles.css`: Design tokens, responsive layouts, component styling, and motion.
- `public/quiz/`: Local SVG illustrations used by questions, with emoji fallback in the component.

## State and Persistence

- The storage key is `kurdish-quiz-player-v1`.
- The player is created after hydration so browser APIs are never accessed during server rendering.
- Every durable player change is written immediately with `savePlayer`.
- Quiz round state stays in React memory and is committed to the player only when a game finishes, except paid jokers, which are deducted immediately.
- Level is derived from total XP rather than stored separately.

## Coding Conventions

- Keep all visible gameplay text in Kurmancî.
- Use PascalCase for React components and camelCase for helpers.
- Add questions only in `src/data/questions.ts` and retain the internal `meaningDe` field.
- Reuse category IDs from the `CategoryId` union; do not introduce free-form category strings.
- Keep persistence backward-compatible by merging saved player data with defaults.
- Prefer Lucide icons for controls and status UI. Emoji are reserved for the requested category and vocabulary artwork.
- Keep mobile interactions touch-friendly with controls at least 44 pixels high.

## Non-Obvious Decisions

- The mixed `Hemû` round draws only from categories already unlocked by the current player.
- Each round always contains ten questions. Smaller category pools are reshuffled and repeated as needed.
- Missing or failed question images automatically fall back to the question emoji.
- Achievement coin rewards are granted once and stored by achievement ID.
- No Netlify data primitive is used because the product requirement explicitly makes the game an anonymous, browser-local experience without synchronization.

## Commands

- `pnpm dev`: Start the Vite development server.
- `pnpm build`: Create the production build used by Netlify.

Do not add authentication or server-side persistence unless the product requirements explicitly change.
