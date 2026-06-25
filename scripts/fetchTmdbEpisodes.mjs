#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const tmdbSeriesId = 2316;
const tmdbApiBaseUrl = 'https://api.themoviedb.org/3';
const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const defaultOutputPath = 'src/data/generated/tmdbEpisodes.ts';
const defaultDelayMs = 100;
const officeSeasonEpisodeCounts = [
  { season: 1, episodeCount: 6 },
  { season: 2, episodeCount: 22 },
  { season: 3, episodeCount: 23 },
  { season: 4, episodeCount: 14 },
  { season: 5, episodeCount: 26 },
  { season: 6, episodeCount: 24 },
  { season: 7, episodeCount: 24 },
  { season: 8, episodeCount: 24 },
  { season: 9, episodeCount: 23 },
];
const generatedDataPattern =
  /export const generatedTmdbEpisodes = ([\s\S]*?) satisfies GeneratedTmdbEpisode\[];/;

function getEpisodeKey(season, episode) {
  return `${season}-${episode}`;
}

function formatEpisodeId(season, episode) {
  return `${String(season).padStart(2, '0')}-${String(episode).padStart(2, '0')}`;
}

function getOfficeEpisodes() {
  return officeSeasonEpisodeCounts.flatMap(({ season, episodeCount }) =>
    Array.from({ length: episodeCount }, (_, index) => {
      const episode = index + 1;

      return {
        id: formatEpisodeId(season, episode),
        season,
        episode,
      };
    }),
  );
}

async function readExistingEpisodes(outputFilePath) {
  try {
    const output = await readFile(outputFilePath, 'utf8');
    const match = output.match(generatedDataPattern);

    if (!match) {
      return [];
    }

    return JSON.parse(match[1]);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

function getTmdbReadAccessToken() {
  return process.env.TMDB_READ_ACCESS_TOKEN ?? null;
}

async function fetchTmdbEpisode(episode, readAccessToken) {
  const url = new URL(
    `${tmdbApiBaseUrl}/tv/${tmdbSeriesId}/season/${episode.season}/episode/${episode.episode}`,
  );
  url.searchParams.set('language', 'en-US');

  const headers = new Headers({
    Accept: 'application/json',
  });

  headers.set('Authorization', `Bearer ${readAccessToken}`);

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.text();
    const bodyPreview = body ? ` ${body.slice(0, 160)}` : '';

    throw new Error(
      `TMDB request failed for season ${episode.season}, episode ${episode.episode} with status ${response.status}.${bodyPreview}`,
    );
  }

  const data = await response.json();
  const stillPath = data.still_path ?? null;

  return {
    id: episode.id,
    season: episode.season,
    episode: episode.episode,
    title: data.name ?? `Episode ${episode.episode}`,
    overview: data.overview ?? '',
    airDate: data.air_date ?? '',
    stillPath,
    imageUrl: stillPath ? `${tmdbImageBaseUrl}${stillPath}` : null,
    tmdbUrl: getTmdbEpisodeUrl(episode.season, episode.episode),
    voteAverage:
      typeof data.vote_average === 'number' ? data.vote_average : null,
    voteCount: typeof data.vote_count === 'number' ? data.vote_count : 0,
    fetchedAt: new Date().toISOString(),
  };
}

function getTmdbEpisodeUrl(season, episode) {
  return `https://www.themoviedb.org/tv/${tmdbSeriesId}-the-office/season/${season}/episode/${episode}`;
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function parseArgs(argv) {
  const options = {
    outputPath: defaultOutputPath,
    delayMs: defaultDelayMs,
    limit: null,
    refresh: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '--refresh') {
      options.refresh = true;
    } else if (arg === '--delay-ms') {
      options.delayMs = Number(argv[index + 1]);
      index += 1;
    } else if (arg === '--limit') {
      options.limit = Number(argv[index + 1]);
      index += 1;
    } else if (arg === '--output') {
      options.outputPath = argv[index + 1];
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      throw new Error(`Unknown positional argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
    throw new Error('--delay-ms must be a positive number.');
  }

  if (
    options.limit !== null &&
    (!Number.isInteger(options.limit) || options.limit < 1)
  ) {
    throw new Error('--limit must be a positive integer.');
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/fetchTmdbEpisodes.mjs [options]

Options:
  --output <path>     Output path. Defaults to ${defaultOutputPath}
  --refresh           Refetch every episode instead of only missing episodes
  --limit <number>    Fetch at most this many missing episodes
  --delay-ms <number> Delay between TMDB requests. Defaults to ${defaultDelayMs}
  -h, --help          Show this help message

Environment:
  TMDB_READ_ACCESS_TOKEN  TMDB v4 read access token

Example:
  TMDB_READ_ACCESS_TOKEN=... node scripts/fetchTmdbEpisodes.mjs
`);
}

function toTypeScript(episodes) {
  return `export type GeneratedTmdbEpisode = {
  id: string;
  season: number;
  episode: number;
  title: string;
  overview: string;
  airDate: string;
  stillPath: string | null;
  imageUrl: string | null;
  tmdbUrl: string;
  voteAverage: number | null;
  voteCount: number;
  fetchedAt: string;
};

export const generatedTmdbEpisodes = ${JSON.stringify(episodes, null, 2)} satisfies GeneratedTmdbEpisode[];
`;
}

async function run() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const outputFilePath = path.resolve(process.cwd(), options.outputPath);
  const officeEpisodes = getOfficeEpisodes();
  const existingEpisodes = await readExistingEpisodes(outputFilePath);
  const existingEpisodeMap = new Map(
    existingEpisodes.map((episode) => [
      getEpisodeKey(episode.season, episode.episode),
      episode,
    ]),
  );
  const episodesToFetch = officeEpisodes
    .filter((episode) => {
      if (options.refresh) {
        return true;
      }

      return !existingEpisodeMap.has(
        getEpisodeKey(episode.season, episode.episode),
      );
    })
    .slice(0, options.limit ?? undefined);
  const readAccessToken = getTmdbReadAccessToken();

  if (episodesToFetch.length > 0 && !readAccessToken) {
    throw new Error('Missing TMDB_READ_ACCESS_TOKEN.');
  }

  const fetchedEpisodeMap = new Map();

  for (const [index, episode] of episodesToFetch.entries()) {
    console.log(
      `Fetching season ${episode.season}, episode ${episode.episode} (${index + 1}/${episodesToFetch.length})`,
    );

    fetchedEpisodeMap.set(
      getEpisodeKey(episode.season, episode.episode),
      await fetchTmdbEpisode(episode, readAccessToken),
    );

    if (index < episodesToFetch.length - 1 && options.delayMs > 0) {
      await wait(options.delayMs);
    }
  }

  const generatedEpisodes = officeEpisodes.map((episode) => {
    const episodeKey = getEpisodeKey(episode.season, episode.episode);

    return (
      fetchedEpisodeMap.get(episodeKey) ??
      existingEpisodeMap.get(episodeKey) ?? {
        id: episode.id,
        season: episode.season,
        episode: episode.episode,
        title: `Episode ${episode.episode}`,
        overview: '',
        airDate: '',
        stillPath: null,
        imageUrl: null,
        tmdbUrl: getTmdbEpisodeUrl(episode.season, episode.episode),
        voteAverage: null,
        voteCount: 0,
        fetchedAt: '',
      }
    );
  });

  await mkdir(path.dirname(outputFilePath), { recursive: true });
  await writeFile(outputFilePath, toTypeScript(generatedEpisodes));

  console.log(`Processed ${officeEpisodes.length} office episodes.`);
  console.log(`Fetched ${episodesToFetch.length} TMDB episodes.`);
  console.log(`Wrote ${outputFilePath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
