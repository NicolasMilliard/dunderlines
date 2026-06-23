import { line, scaleLinear } from 'd3';

const points: [number, number][] = [
  [1, 8587],
  [2, 26367],
  [3, 24066],
  [4, 20143],
  [5, 27168],
  [6, 24924],
  [7, 18397],
  [8, 0],
  [9, 22],
];

const chartWidth = 480;
const chartHeight = 48;
const chartMargin = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 112,
};

const xValues = points.map(([x]) => x);
const yValues = points.map(([, y]) => y);

const xScale = scaleLinear()
  .domain([Math.min(...xValues), Math.max(...xValues)])
  .range([chartMargin.left, chartWidth - chartMargin.right]);

const yScale = scaleLinear()
  .domain([0, Math.max(...yValues)])
  .range([chartHeight - chartMargin.bottom, chartMargin.top]);

const d3Line = line<[number, number]>()
  .x(([x]) => xScale(x))
  .y(([, y]) => yScale(y));

const labelPoint = points[0];
const labelX = xScale(labelPoint[0]) - 12;
const labelY = yScale(labelPoint[1]);

function App() {
  return (
    <main>
      <h1 className="text-3xl font-semibold">Dunderlines</h1>
      <svg
        className="h-auto w-full max-w-xl"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label="Words spoken over time"
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
          Michael Scott
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
    </main>
  );
}

export default App;
