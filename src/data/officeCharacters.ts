import type { LinePoint } from '../types';

export type EpisodeWordCount = {
  season: number;
  episode: number;
  wordsSpoken: number;
};

export type OfficeCharacter = {
  id: string;
  name: string;
  episodes: EpisodeWordCount[];
};

export const toLinePoints = (episodes: EpisodeWordCount[]): LinePoint[] =>
  episodes.map(({ wordsSpoken }, index) => [index + 1, wordsSpoken]);

export const officeCharacters: OfficeCharacter[] = [
  {
    id: 'michael-scott',
    name: 'Michael Scott',
    episodes: [
      { season: 1, episode: 1, wordsSpoken: 8587 },
      { season: 2, episode: 1, wordsSpoken: 26367 },
      { season: 3, episode: 1, wordsSpoken: 24066 },
      { season: 4, episode: 1, wordsSpoken: 20143 },
      { season: 5, episode: 1, wordsSpoken: 27168 },
      { season: 6, episode: 1, wordsSpoken: 24924 },
      { season: 7, episode: 1, wordsSpoken: 18397 },
      { season: 8, episode: 1, wordsSpoken: 0 },
      { season: 9, episode: 1, wordsSpoken: 22 },
    ],
  },
  {
    id: 'pam-beesly',
    name: 'Pam Beesly',
    episodes: [
      { season: 1, episode: 1, wordsSpoken: 3100 },
      { season: 2, episode: 1, wordsSpoken: 7400 },
      { season: 3, episode: 1, wordsSpoken: 6800 },
      { season: 4, episode: 1, wordsSpoken: 5900 },
      { season: 5, episode: 1, wordsSpoken: 8300 },
      { season: 6, episode: 1, wordsSpoken: 7100 },
      { season: 7, episode: 1, wordsSpoken: 6200 },
      { season: 8, episode: 1, wordsSpoken: 5400 },
      { season: 9, episode: 1, wordsSpoken: 6600 },
    ],
  },
  {
    id: 'jim-halpert',
    name: 'Jim Halpert',
    episodes: [
      { season: 1, episode: 1, wordsSpoken: 4200 },
      { season: 2, episode: 1, wordsSpoken: 8800 },
      { season: 3, episode: 1, wordsSpoken: 9100 },
      { season: 4, episode: 1, wordsSpoken: 6900 },
      { season: 5, episode: 1, wordsSpoken: 7600 },
      { season: 6, episode: 1, wordsSpoken: 7200 },
      { season: 7, episode: 1, wordsSpoken: 6500 },
      { season: 8, episode: 1, wordsSpoken: 6100 },
      { season: 9, episode: 1, wordsSpoken: 7000 },
    ],
  },
];
