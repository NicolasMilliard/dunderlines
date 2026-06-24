type CharacterLineLabelProps = {
  name: string;
  totalWordsSpoken: number;
  x: number;
  y: number;
};

export function CharacterLineLabel({
  name,
  totalWordsSpoken,
  x,
  y,
}: CharacterLineLabelProps) {
  return (
    <text x={x} y={y} fill="black" textAnchor="end">
      <tspan x={x} dy="0" fontSize="14" fontWeight="600">
        {name}
      </tspan>
      <tspan x={x} dy="13" fontSize="12" fill="black" fillOpacity="0.55">
        {totalWordsSpoken.toLocaleString()} words
      </tspan>
    </text>
  );
}
