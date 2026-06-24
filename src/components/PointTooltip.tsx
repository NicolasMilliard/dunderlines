type PointTooltipProps = {
  chartWidth: number;
  wordsSpoken: number;
  x: number;
  y: number;
};

const tooltipPadding = 4;

export function PointTooltip({
  chartWidth,
  wordsSpoken,
  x,
  y,
}: PointTooltipProps) {
  const label = wordsSpoken.toLocaleString();
  const tooltipWidth = Math.max(36, label.length * 5 + 12) + 24;
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
      <rect
        x={-tooltipWidth / 2}
        y="-9"
        width={tooltipWidth}
        height="16"
        rx="4"
        fill="black"
      />
      <text
        y="2"
        fill="white"
        fontSize="9"
        fontWeight="700"
        textAnchor="middle"
      >
        {label} words
      </text>
    </g>
  );
}
