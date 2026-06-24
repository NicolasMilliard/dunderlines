function formatEpisodePart(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

export function getScrantonicityEpisodeUrl(
  season: number,
  episodeNumber: number,
) {
  const formattedSeason = formatEpisodePart(season);
  const formattedEpisode = formatEpisodePart(episodeNumber);

  return `https://scrantonicity.co/episode/${formattedSeason}-${formattedEpisode}`;
}
