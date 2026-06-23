export type LinePoint = [
  episodeIndex: number,
  wordsSpoken: number,
  season: number,
  episode: number,
];

export type CharacterLineData = {
  id: string;
  name: string;
  totalWordsSpoken: number;
  points: LinePoint[];
};
