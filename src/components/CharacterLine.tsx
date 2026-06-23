import { line, scaleLinear } from 'd3';
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
  left: 112,
};

export function CharacterLine({ text, points }: CharacterLineProps) {
  if (points.length === 0) {
    return null;
  }

  const xValues = points.map(([x]) => x);
  const yValues = points.map(([, y]) => y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  const xScale = scaleLinear()
    .domain(minX === maxX ? [minX - 1, maxX + 1] : [minX, maxX])
    .range([chartMargin.left, chartWidth - chartMargin.right]);

  const yScale = scaleLinear()
    .domain([0, Math.max(...yValues, 1)])
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
      />
    </svg>
  );
}
