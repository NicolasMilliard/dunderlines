import { useCallback, useEffect, useRef, useState } from 'react';
import { getScrantonicityEpisodeUrl } from '../services/scrantonicity';
import {
  getTmdbEpisodeDetails,
  getTmdbEpisodeUrl,
  type TmdbEpisodeDetails,
} from '../services/tmdb';
import { EpisodeSheetUnavailable } from './EpisodeSheetUnavailable';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

type EpisodeSheetProps = {
  characterName: string;
  season: number;
  episode: number;
  onClose: () => void;
};

const sheetAnimationMs = 200;

type EpisodeDetailsState =
  | { status: 'ready'; episode: TmdbEpisodeDetails }
  | { status: 'unavailable' };

export function EpisodeSheet({
  characterName,
  season,
  episode,
  onClose,
}: EpisodeSheetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const closeTimeoutRef = useRef<number | null>(null);
  const tmdbUrl = getTmdbEpisodeUrl(season, episode);
  const scrantonicityUrl = getScrantonicityEpisodeUrl(season, episode);
  const generatedEpisodeDetails = getTmdbEpisodeDetails(season, episode);
  const episodeDetails: EpisodeDetailsState = generatedEpisodeDetails
    ? { status: 'ready', episode: generatedEpisodeDetails }
    : { status: 'unavailable' };

  const requestClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      return;
    }

    setIsOpen(false);
    closeTimeoutRef.current = window.setTimeout(onClose, sheetAnimationMs);
  }, [onClose]);

  const handleOpenChange = useCallback(
    (nextIsOpen: boolean) => {
      if (nextIsOpen) {
        setIsOpen(true);
        return;
      }

      requestClose();
    },
    [requestClose],
  );

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader className="sr-only">
          <SheetTitle>{characterName} episode details</SheetTitle>
          <SheetDescription>
            Season {season}, episode {episode}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-12 grid gap-5">
          {episodeDetails.status === 'ready' ? (
            <>
              {episodeDetails.episode.imageUrl ? (
                <img
                  className="aspect-video w-full rounded-lg object-cover"
                  src={episodeDetails.episode.imageUrl}
                  alt={episodeDetails.episode.title}
                />
              ) : null}

              <div>
                <p className="text-sm font-medium text-black/50">
                  Season {season}, Episode {episode}
                </p>
                <h2 className="font-title mt-1 text-2xl text-black">
                  {episodeDetails.episode.title}
                </h2>
              </div>

              <dl className="grid gap-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Season</dt>
                  <dd className="m-0 text-2xl font-bold text-black">
                    {season}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Episode</dt>
                  <dd className="m-0 text-2xl font-bold text-black">
                    {episode}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Rating</dt>
                  <dd className="m-0 text-2xl font-bold text-black">
                    {episodeDetails.episode.voteAverage?.toFixed(1) ?? '-'}
                    <span className="text-sm font-medium text-black/50">
                      {' '}
                      / 10
                    </span>
                  </dd>
                </div>
              </dl>

              {episodeDetails.episode.overview ? (
                <p className="text-sm leading-6 text-black/70">
                  {episodeDetails.episode.overview}
                </p>
              ) : null}
            </>
          ) : null}

          {episodeDetails.status === 'unavailable' ? (
            <EpisodeSheetUnavailable episode={episode} season={season} />
          ) : null}

          <a
            className="mt-2 inline-flex text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 hover:decoration-black"
            href={tmdbUrl}
            rel="noreferrer"
            target="_blank"
          >
            View on TMDB
          </a>

          <a
            className="mt-2 inline-flex text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 hover:decoration-black"
            href={scrantonicityUrl}
            rel="noreferrer"
            target="_blank"
          >
            Read script
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
