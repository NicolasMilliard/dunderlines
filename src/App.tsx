import { line } from 'd3';

const points: [number, number][] = [
  [20, 200],
  [100, 20],
  [180, 70],
  [260, 35],
];

const d3Line = line<[number, number]>()
  .x(([x]) => x)
  .y(([, y]) => y);

function App() {
  return (
    <main>
      <h1 className="text-3xl font-semibold">Dunderlines</h1>
      <svg width="280" height="100" viewBox="0 0 280 100" role="img">
        <path
          d={d3Line(points) ?? undefined}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </main>
  );
}

export default App;
