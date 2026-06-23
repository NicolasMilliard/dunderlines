import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import type { LinePoint } from '../types';

type CharacterLineProps = {
  text: string;
  points: LinePoint[];
};

const chartWidth = 480;
const chartHeight = 48;
const chartMargin = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 120,
};

export function CharacterLine({ text, points }: CharacterLineProps) {
  if (points.length === 0) {
    return null;
  }

  const extent = points.reduce(
    (current, [x, y]) => ({
      minX: Math.min(current.minX, x),
      maxX: Math.max(current.maxX, x),
      maxY: Math.max(current.maxY, y),
    }),
    {
      minX: points[0][0],
      maxX: points[0][0],
      maxY: 1,
    },
  );

  const xScale = scaleLinear()
    .domain(
      extent.minX === extent.maxX
        ? [extent.minX - 1, extent.maxX + 1]
        : [extent.minX, extent.maxX],
    )
    .range([chartMargin.left, chartWidth - chartMargin.right]);

  const yScale = scaleLinear()
    .domain([0, extent.maxY])
    .range([chartHeight - chartMargin.bottom, chartMargin.top]);

  const d3Line = line<LinePoint>()
    .x(([x]) => xScale(x))
    .y(([, y]) => yScale(y));

  const labelPoint = points[0];
  const labelX = xScale(labelPoint[0]) - 12;
  const labelY = yScale(labelPoint[1]);

  return (
    <svg
      className="h-auto w-full max-w-xl"
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label={`${text} words spoken over time`}
    >
      <text
        x={labelX}
        y={labelY}
        dy="0.35em"
        fill="black"
        fontSize="12"
        fontWeight="600"
        textAnchor="end"
      >
        {text}
      </text>
      <path
        d={d3Line(points) ?? undefined}
        fill="none"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
