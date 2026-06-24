# Dunderlines

<img src="./public/the-office-sign.png" width="280px" height="auto" />

Visualization of words spoken by characters from The Office.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- D3 scale/shape helpers

## Getting Started

```bash
bun install
bun run dev
```

Useful scripts:

```bash
bun run build
bun run lint
bun run words:featured
```

## Data

The transcript source lives in:

```text
src/data/the-office.json
```

The app uses generated character data from:

```text
src/data/generated/featuredOfficeCharacters.ts
```

After editing the transcript or the featured character list, regenerate the app
data:

```bash
bun run words:featured
```

Do not edit generated data manually. See [scripts/README.md](scripts/README.md)
for the word-counting rules and script details.

## Optional TMDB Data

Episode details can be enriched with TMDB data. Add a local `.env.local` file:

```text
VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
```
