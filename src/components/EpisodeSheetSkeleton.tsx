import { Skeleton } from './Skeleton';

const skeletonDetailRows = ['season', 'episode', 'rating'];

export function EpisodeSheetSkeleton() {
  return (
    <div className="grid gap-5" aria-hidden="true">
      <Skeleton className="aspect-video w-full rounded-lg" />

      <div className="grid gap-2">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-8 w-4/5 rounded-full" />
      </div>

      <dl className="grid gap-4">
        {skeletonDetailRows.map((item) => (
          <div
            className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-3"
            key={item}
          >
            <dt>
              <Skeleton className="h-3 w-16 rounded-full" />
            </dt>
            <dd className="m-0">
              <Skeleton className="h-7 w-12 rounded-full" />
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-2">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-11/12 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
    </div>
  );
}
