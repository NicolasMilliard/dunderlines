import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  getTmdbEpisodeDetails,
  getTmdbEpisodeUrl,
  hasTmdbCredentials,
  type TmdbEpisodeDetails,
} from '../services/tmdb';
import { EpisodeSheetSkeleton } from './EpisodeSheetSkeleton';
import { EpisodeSheetUnavailable } from './EpisodeSheetUnavailable';

type EpisodeSheetProps = {
  characterName: string;
  season: number;
  episode: number;
  onClose: () => void;
};

const sheetAnimationMs = 200;

type EpisodeDetailsState =
  | { status: 'loading' }
  | { status: 'ready'; episode: TmdbEpisodeDetails }
  | { status: 'unavailable' };

export function EpisodeSheet({
  characterName,
  season,
  episode,
  onClose,
}: EpisodeSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetailsState>({
    status: hasTmdbCredentials ? 'loading' : 'unavailable',
  });
  const closeTimeoutRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const tmdbUrl = getTmdbEpisodeUrl(season, episode);

  const requestClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      return;
    }

    setIsVisible(false);
    closeTimeoutRef.current = window.setTimeout(onClose, sheetAnimationMs);
  }, [onClose]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
      sheetRef.current?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasTmdbCredentials) {
      return;
    }

    let isActive = true;

    Promise.resolve()
      .then(() => {
        if (isActive) {
          setEpisodeDetails({ status: 'loading' });
        }

        return getTmdbEpisodeDetails(season, episode);
      })
      .then((episode) => {
        if (isActive) {
          setEpisodeDetails({ status: 'ready', episode });
        }
      })
      .catch(() => {
        if (isActive) {
          setEpisodeDetails({ status: 'unavailable' });
        }
      });

    return () => {
      isActive = false;
    };
  }, [episode, season]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestClose]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/20 transition-opacity duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={requestClose}
    >
      <aside
        ref={sheetRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] overflow-y-auto border-l border-black/10 bg-white p-6 shadow-[-16px_0_40px_rgb(0_0_0_/_0.14)] transition-transform duration-200 ease-out outline-none max-sm:top-auto max-sm:bottom-0 max-sm:h-auto max-sm:max-h-[88vh] max-sm:min-h-[320px] max-sm:max-w-none max-sm:border-l-0 max-sm:border-t max-sm:shadow-[0_-16px_40px_rgb(0_0_0_/_0.14)] ${
          isVisible
            ? 'translate-x-0 max-sm:translate-y-0'
            : 'translate-x-full max-sm:translate-x-0 max-sm:translate-y-full'
        }`}
        aria-label={`${characterName} episode details`}
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <button
          className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[22px] leading-none text-black"
          type="button"
          aria-label="Close episode details"
          onClick={requestClose}
        >
          <X size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <div className="mt-12 grid gap-5">
          {episodeDetails.status === 'loading' ? (
            <>
              <p className="sr-only" role="status">
                Loading episode details from TMDB.
              </p>
              <EpisodeSheetSkeleton />
            </>
          ) : null}

          {episodeDetails.status === 'ready' ? (
            <>
              {episodeDetails.episode.imageUrl ? (
                <img
                  className="aspect-video w-full rounded-lg object-cover"
                  src={episodeDetails.episode.imageUrl}
                  alt=""
                />
              ) : null}

              <div>
                <p className="text-sm font-medium text-black/50">
                  Season {season}, Episode {episode}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-black">
                  {episodeDetails.episode.title}
                </h2>
              </div>

              <dl className="grid gap-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Season</dt>
                  <dd className="m-0 text-2xl font-bold text-black">{season}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Episode</dt>
                  <dd className="m-0 text-2xl font-bold text-black">{episode}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3">
                  <dt className="text-sm text-black/60">Rating</dt>
                  <dd className="m-0 text-2xl font-bold text-black">
                    {episodeDetails.episode.voteAverage?.toFixed(1) ?? '—'}
                    <span className="text-sm font-medium text-black/50"> / 10</span>
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
        </div>
      </aside>
    </div>
  );
}
