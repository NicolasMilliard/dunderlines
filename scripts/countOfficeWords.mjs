#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultOutputPath = path.join(os.tmpdir(), 'officeWordCounts.json');

export function countWords(line) {
  if (typeof line !== 'string') {
    return 0;
  }

  return line.match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function getEpisodes(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.episodes)) {
    return data.episodes;
  }

  throw new Error('Expected the input JSON to be an array of episodes.');
}

export function normalizeSpeaker(speaker) {
  return typeof speaker === 'string' ? speaker.trim() : '';
}

function summarizeEpisode(episode, index) {
  const characters = new Map();
  const scenes = Array.isArray(episode.scenes) ? episode.scenes : [];

  for (const scene of scenes) {
    if (!Array.isArray(scene)) {
      continue;
    }

    for (const entry of scene) {
      const speaker = normalizeSpeaker(entry?.speaker);
      const words = countWords(entry?.line);

      if (!speaker || words === 0) {
        continue;
      }

      const current = characters.get(speaker) ?? {
        speaker,
        wordsSpoken: 0,
        lineCount: 0,
      };

      current.wordsSpoken += words;
      current.lineCount += 1;
      characters.set(speaker, current);
    }
  }

  return {
    id: String(episode.id ?? `episode-${index + 1}`),
    season: episode.season,
    episode: episode.episode,
    title: String(episode.title ?? ''),
    characters: [...characters.values()].sort(
      (a, b) =>
        b.wordsSpoken - a.wordsSpoken || a.speaker.localeCompare(b.speaker),
    ),
  };
}

function buildCharacterTimelines(episodes) {
  const characterNames = new Set();
  const episodeCharacterLookups = episodes.map((episode) => ({
    episode,
    characters: new Map(
      episode.characters.map((character) => [character.speaker, character]),
    ),
  }));

  for (const episode of episodes) {
    for (const character of episode.characters) {
      characterNames.add(character.speaker);
    }
  }

  return [...characterNames]
    .map((speaker) => {
      const episodeCounts = episodeCharacterLookups.map(
        ({ episode, characters }) => {
          const character = characters.get(speaker);

          return {
            id: episode.id,
            season: episode.season,
            episode: episode.episode,
            title: episode.title,
            wordsSpoken: character?.wordsSpoken ?? 0,
            lineCount: character?.lineCount ?? 0,
          };
        },
      );

      return {
        speaker,
        totalWordsSpoken: episodeCounts.reduce(
          (total, episode) => total + episode.wordsSpoken,
          0,
        ),
        totalLineCount: episodeCounts.reduce(
          (total, episode) => total + episode.lineCount,
          0,
        ),
        episodes: episodeCounts,
      };
    })
    .sort(
      (a, b) =>
        b.totalWordsSpoken - a.totalWordsSpoken ||
        a.speaker.localeCompare(b.speaker),
    );
}

export function buildWordCounts(data) {
  const episodes = getEpisodes(data).map(summarizeEpisode);
  const characters = buildCharacterTimelines(episodes);

  return {
    episodes,
    characters,
  };
}

export function parseJsonFile(input) {
  return JSON.parse(input.replace(/^\uFEFF/, ''));
}

async function run() {
  const [inputPath, outputPath = defaultOutputPath] = process.argv.slice(2);

  if (!inputPath || inputPath === '-h' || inputPath === '--help') {
    console.log(`Usage: node scripts/countOfficeWords.mjs <input-json-path> [output-json-path]

Example:
  node scripts/countOfficeWords.mjs src/data/the-office.json

Default output:
  ${defaultOutputPath}`);
    process.exit(inputPath ? 0 : 1);
  }

  const inputFilePath = path.resolve(process.cwd(), inputPath);
  const outputFilePath = path.resolve(process.cwd(), outputPath);
  const input = parseJsonFile(await readFile(inputFilePath, 'utf8'));
  const wordCounts = buildWordCounts(input);
  const totalWords = wordCounts.characters.reduce(
    (total, character) => total + character.totalWordsSpoken,
    0,
  );
  const totalLines = wordCounts.characters.reduce(
    (total, character) => total + character.totalLineCount,
    0,
  );

  await mkdir(path.dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, `${JSON.stringify(wordCounts, null, 2)}\n`);

  console.log(`Counted ${wordCounts.episodes.length} episodes.`);
  console.log(`Found ${wordCounts.characters.length} speakers.`);
  console.log(`Counted ${totalLines} lines and ${totalWords} words.`);
  console.log(`Wrote ${outputFilePath}`);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  run().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
