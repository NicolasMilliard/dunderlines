type EpisodeSheetUnavailableProps = {
  episode: number;
  season: number;
};

export function EpisodeSheetUnavailable({
  episode,
  season,
}: EpisodeSheetUnavailableProps) {
  return (
    <>
      <div>
        <p className="text-sm font-medium text-black/50">
          Season {season}, Episode {episode}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-black">Episode details</h2>
      </div>
      <p className="text-sm leading-6 text-black/60">
        Episode details are unavailable right now.
      </p>
    </>
  );
}
