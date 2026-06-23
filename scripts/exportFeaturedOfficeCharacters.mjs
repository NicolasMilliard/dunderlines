#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const defaultInputPath = 'src/data/generated/officeWordCounts.json';
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

function parseJsonFile(input) {
  return JSON.parse(input.replace(/^\uFEFF/, ''));
}

function getCharacter(wordCounts, speaker) {
  const character = wordCounts.characters?.find(
    (item) => item.speaker === speaker,
  );

  if (!character) {
    throw new Error(
      `Could not find speaker "${speaker}" in generated word counts.`,
    );
  }

  return character;
}

function toFeaturedCharacter(wordCounts, character) {
  const source = getCharacter(wordCounts, character.speaker);

  return {
    id: character.id,
    name: character.name,
    totalWordsSpoken: source.totalWordsSpoken,
    points: source.episodes.map((episode, index) => [
      index + 1,
      episode.wordsSpoken,
    ]),
  };
}

function toTypeScript(characters) {
  return `import type { CharacterLineData } from '../../types';

export const featuredOfficeCharacterLines = ${JSON.stringify(
    characters,
    null,
    2,
  )} satisfies CharacterLineData[];
`;
}

async function run() {
  const [inputPath = defaultInputPath, outputPath = defaultOutputPath] =
    process.argv.slice(2);
  const inputFilePath = path.resolve(process.cwd(), inputPath);
  const outputFilePath = path.resolve(process.cwd(), outputPath);
  const wordCounts = parseJsonFile(await readFile(inputFilePath, 'utf8'));
  const characters = featuredCharacters.map((character) =>
    toFeaturedCharacter(wordCounts, character),
  );

  await mkdir(path.dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, toTypeScript(characters));

  console.log(`Exported ${characters.length} featured characters.`);
  console.log(`Wrote ${outputFilePath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
