type EpisodeSheetProps = {
  characterName: string;
  season: number;
  episode: number;
  onClose: () => void;
};

export function EpisodeSheet({
  characterName,
  season,
  episode,
  onClose,
}: EpisodeSheetProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose}>
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-[360px] border-l border-black/10 bg-white p-6 shadow-[-16px_0_40px_rgb(0_0_0_/_0.14)] max-sm:top-auto max-sm:bottom-0 max-sm:h-auto max-sm:min-h-[220px] max-sm:max-w-none max-sm:border-l-0 max-sm:border-t max-sm:shadow-[0_-16px_40px_rgb(0_0_0_/_0.14)]"
        aria-label={`${characterName} episode details`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[22px] leading-none text-black"
          type="button"
          aria-label="Close episode details"
          onClick={onClose}
        >
          ×
        </button>
        <dl className="mt-12 grid gap-5">
          <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
            <dt className="text-sm text-black/60">Season</dt>
            <dd className="m-0 text-2xl font-bold text-black">{season}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
            <dt className="text-sm text-black/60">Episode</dt>
            <dd className="m-0 text-2xl font-bold text-black">{episode}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
