#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  countWords,
  getEpisodes,
  normalizeSpeaker,
  parseJsonFile,
} from './countOfficeWords.mjs';

const defaultInputPath = 'src/data/the-office.json';
const defaultOutputPath = 'src/data/generated/featuredOfficeCharacters.ts';

const featuredCharacters = [
  { speaker: 'Michael', id: 'michael-scott', name: 'Michael Scott' },
  { speaker: 'Dwight', id: 'dwight-schrute', name: 'Dwight Schrute' },
  { speaker: 'Jim', id: 'jim-halpert', name: 'Jim Halpert' },
  { speaker: 'Pam', id: 'pam-beesly', name: 'Pam Beesly' },
  { speaker: 'Andy', id: 'andy-bernard', name: 'Andy Bernard' },
  { speaker: 'Angela', id: 'angela-martin', name: 'Angela Martin' },
  { speaker: 'Erin', id: 'erin-hannon', name: 'Erin Hannon' },
  { speaker: 'Kevin', id: 'kevin-malone', name: 'Kevin Malone' },
  { speaker: 'Oscar', id: 'oscar-martinez', name: 'Oscar Martinez' },
  { speaker: 'Ryan', id: 'ryan-howard', name: 'Ryan Howard' },
  { speaker: 'Darryl', id: 'darryl-philbin', name: 'Darryl Philbin' },
  { speaker: 'Kelly', id: 'kelly-kapoor', name: 'Kelly Kapoor' },
  { speaker: 'Jan', id: 'jan-levinson', name: 'Jan Levinson' },
  { speaker: 'Toby', id: 'toby-flanderson', name: 'Toby Flanderson' },
  { speaker: 'Phyllis', id: 'phyllis-smith', name: 'Phyllis Smith' },
  { speaker: 'Nellie', id: 'nellie-bertram', name: 'Nellie Bertram' },
  { speaker: 'Stanley', id: 'stanley-hudson', name: 'Stanley Hudson' },
  { speaker: 'Robert', id: 'robert-california', name: 'Robert California' },
  { speaker: 'Gabe', id: 'gabe-lewis', name: 'Gabe Lewis' },
  { speaker: 'David Wallace', id: 'david-wallace', name: 'David Wallace' },
  { speaker: 'Holly', id: 'holly-flax', name: 'Holly Flax' },
  { speaker: 'Meredith', id: 'meredith-palmer', name: 'Meredith Palmer' },
  { speaker: 'Creed', id: 'creed-bratton', name: 'Creed Bratton' },
  { speaker: 'Deangelo', id: 'deangelo-vickers', name: 'Deangelo Vickers' },
  { speaker: 'Jo', id: 'jo-bennett', name: 'Jo Bennet' },
  { speaker: 'Karen', id: 'karen-filippelli', name: 'Karen Filippelli' },
];

function buildFeaturedCharacters(data) {
  const episodes = getEpisodes(data);
  const speakerMap = new Map(
    featuredCharacters.map((character) => [
      character.speaker,
      {
        id: character.id,
        name: character.name,
        totalWordsSpoken: 0,
        points: [],
      },
    ]),
  );

  episodes.forEach((episode, episodeIndex) => {
    const episodeWordsBySpeaker = new Map();
    const scenes = Array.isArray(episode.scenes) ? episode.scenes : [];

    for (const scene of scenes) {
      if (!Array.isArray(scene)) {
        continue;
      }

      for (const entry of scene) {
        const speaker = normalizeSpeaker(entry?.speaker);

        if (!speakerMap.has(speaker)) {
          continue;
        }

        const words = countWords(entry?.line);
        episodeWordsBySpeaker.set(
          speaker,
          (episodeWordsBySpeaker.get(speaker) ?? 0) + words,
        );
      }
    }

    for (const character of featuredCharacters) {
      const featuredCharacter = speakerMap.get(character.speaker);
      const wordsSpoken = episodeWordsBySpeaker.get(character.speaker) ?? 0;

      featuredCharacter.totalWordsSpoken += wordsSpoken;
      featuredCharacter.points.push([episodeIndex + 1, wordsSpoken]);
    }
  });

  return [...speakerMap.values()];
}

function toTypeScript(characters) {
  return `import type { CharacterLineData } from '../../types';

export const featuredOfficeCharacterLines = ${JSON.stringify(characters)} satisfies CharacterLineData[];
`;
}

async function run() {
  const [inputPath = defaultInputPath, outputPath = defaultOutputPath] =
    process.argv.slice(2);
  const inputFilePath = path.resolve(process.cwd(), inputPath);
  const outputFilePath = path.resolve(process.cwd(), outputPath);
  const transcript = parseJsonFile(await readFile(inputFilePath, 'utf8'));
  const characters = buildFeaturedCharacters(transcript);

  await mkdir(path.dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, toTypeScript(characters));

  console.log(`Exported ${characters.length} featured characters.`);
  console.log(`Wrote ${outputFilePath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
