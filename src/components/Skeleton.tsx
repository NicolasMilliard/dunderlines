type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-md bg-black/10 motion-safe:animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
