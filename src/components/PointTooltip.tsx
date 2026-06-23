type PointTooltipProps = {
  chartWidth: number;
  episode: number;
  season: number;
  x: number;
  y: number;
};

const tooltipWidth = 36;
const tooltipPadding = 4;

export function PointTooltip({
  chartWidth,
  episode,
  season,
  x,
  y,
}: PointTooltipProps) {
  const tooltipX = Math.min(
    Math.max(x, tooltipWidth / 2 + tooltipPadding),
    chartWidth - tooltipWidth / 2 - tooltipPadding,
  );
  const tooltipY = Math.max(y - 18, 10);

  return (
    <g
      className="pointer-events-none opacity-0 transition-opacity duration-150 ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100"
      transform={`translate(${tooltipX} ${tooltipY})`}
    >
      <rect x="-18" y="-9" width={tooltipWidth} height="16" rx="4" fill="black" />
      <text y="2" fill="white" fontSize="9" fontWeight="700" textAnchor="middle">
        S{season} E{episode}
      </text>
    </g>
  );
}
