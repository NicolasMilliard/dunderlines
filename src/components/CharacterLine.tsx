import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { useState } from 'react';
import type { LinePoint } from '../types';
import { CharacterLineLabel } from './CharacterLineLabel';
import { EpisodeSheet } from './EpisodeSheet';
import { PointTooltip } from './PointTooltip';

type CharacterLineProps = {
  text: string;
  totalWordsSpoken: number;
  points: LinePoint[];
};

type SelectedPoint = {
  season: number;
  episode: number;
};

const chartWidth = 680;
const chartHeight = 64;
const chartMargin = {
  top: 8,
  right: 8,
  bottom: 8,
  left: 132,
};

export function CharacterLine({
  text,
  totalWordsSpoken,
  points,
}: CharacterLineProps) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(
    null,
  );

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
  const formattedTotalWords = totalWordsSpoken.toLocaleString();
  const labelY = Math.min(
    yScale(labelPoint[1]),
    chartHeight - chartMargin.bottom - 13,
  );
  const scaledPoints = points.map(
    ([episodeIndex, wordsSpoken, season, episode]) => ({
      cx: xScale(episodeIndex),
      cy: yScale(wordsSpoken),
      episodeIndex,
      season,
      episode,
      wordsSpoken,
    }),
  );

  const lineAnimationKey = points
    .map(([episodeIndex, wordsSpoken]) => `${episodeIndex}-${wordsSpoken}`)
    .join('|');

  return (
    <>
      <div className="w-full max-w-2xl overflow-x-auto overscroll-x-contain max-sm:pb-2">
        <svg
          className="h-auto w-full max-sm:w-170 max-sm:max-w-none"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label={`${text}: ${formattedTotalWords} words spoken over time`}
        >
          <CharacterLineLabel
            name={text}
            totalWordsSpoken={totalWordsSpoken}
            x={labelX}
            y={labelY}
          />
          <path
            key={lineAnimationKey}
            d={d3Line(points) ?? undefined}
            fill="none"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            className="motion-safe:animate-[draw-line_700ms_ease-out_forwards]"
          />
          {scaledPoints.map(
            ({ cx, cy, episodeIndex, wordsSpoken, season, episode }) => (
              <g
                key={episodeIndex}
                className="group cursor-pointer outline-none"
                role="button"
                tabIndex={0}
                aria-label={`${text}, season ${season}, episode ${episode}: ${wordsSpoken} words`}
                onClick={() => setSelectedPoint({ season, episode })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedPoint({ season, episode });
                  }
                }}
              >
                <circle cx={cx} cy={cy} r="6" fill="transparent" />
                <circle
                  className="origin-center fill-transparent opacity-45 transition-[opacity,transform] duration-150 ease-in-out transform-fill group-hover:scale-[1.8] group-hover:fill-black group-hover:opacity-100 group-focus-visible:scale-[1.8] group-focus-visible:fill-black group-focus-visible:opacity-100"
                  cx={cx}
                  cy={cy}
                  r="2"
                />
                <PointTooltip
                  chartWidth={chartWidth}
                  wordsSpoken={wordsSpoken}
                  x={cx}
                  y={cy}
                />
              </g>
            ),
          )}
        </svg>
      </div>

      {selectedPoint ? (
        <EpisodeSheet
          characterName={text}
          season={selectedPoint.season}
          episode={selectedPoint.episode}
          onClose={() => setSelectedPoint(null)}
        />
      ) : null}
    </>
  );
}
