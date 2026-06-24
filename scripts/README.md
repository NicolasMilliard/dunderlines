# Scripts

This folder contains the transcript processing scripts used by Dunderlines.

## Source Data

The scripts read `src/data/the-office.json`. Each episode contains scenes, and
each scene contains dialogue entries with a `speaker` and a `line`.

Speaker names can be a single character:

```json
{ "speaker": "Jim", "line": "Absolutely." }
```

Or a comma-separated group:

```json
{ "speaker": "Jim, Pam", "line": "Yeah." }
```

Comma-separated speakers are split before counting, so the same spoken words are
counted once for each listed speaker.

## Word Counting Rules

Shared parsing rules live in `countOfficeWords.mjs`.

- Bracketed stage directions are ignored before counting words.
- Comma-separated speaker labels are split into individual speaker names.
- Empty speaker names and lines with no spoken words are ignored.

For example:

```text
[laughs] Hello there.
```

counts as `2` words.

```text
Jim, Pam: Yeah.
```

counts `1` word for Jim and `1` word for Pam.

## `countOfficeWords.mjs`

This is the full audit/debug script. It reads the transcript and writes a large
JSON summary for every speaker it finds.

Run it with:

```bash
node scripts/countOfficeWords.mjs src/data/the-office.json
```

Or choose an output path:

```bash
node scripts/countOfficeWords.mjs src/data/the-office.json /tmp/officeWordCounts.json
```

Use this when you want to inspect all speakers, totals, or per-episode counts.
It is not the file used directly by the web app.

## `exportFeaturedOfficeCharacters.mjs`

This is the web-app export script. It reads the same transcript, keeps only the
characters listed in the `featuredCharacters` array, and writes the compact
TypeScript data used by the app:

```text
src/data/generated/featuredOfficeCharacters.ts
```

Run it with:

```bash
bun run words:featured
```

Use this after editing `src/data/the-office.json` or after changing the
`featuredCharacters` list.

Do not manually edit `src/data/generated/featuredOfficeCharacters.ts`; it is
generated and will be overwritten.
