import { useMemo, useState } from 'react';
import { CharacterLine } from '../components/CharacterLine';
import { MultiSelectDropdown } from '../components/MultiSelectDropdown';
import { RouteLink } from '../components/RouteLink';
import { officeCharacters } from '../data/officeCharacters';

const characterOptions = officeCharacters.map((character) => ({
  label: character.name,
  value: character.id,
}));
const allCharacterIds = characterOptions.map((option) => option.value);

const seasonOptions = [
  ...new Set(
    officeCharacters.flatMap((character) =>
      character.points.map(([, , season]) => season),
    ),
  ),
]
  .sort((seasonA, seasonB) => seasonA - seasonB)
  .map((season) => ({
    label: `Season ${season}`,
    value: String(season),
  }));
const allSeasonValues = seasonOptions.map((option) => option.value);

export function HomePage() {
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    allCharacterIds,
  );
  const [selectedSeasonValues, setSelectedSeasonValues] =
    useState<string[]>(allSeasonValues);

  const visibleCharacters = useMemo(() => {
    const selectedCharacterIdSet = new Set(selectedCharacterIds);
    const selectedSeasonValueSet = new Set(selectedSeasonValues);

    return officeCharacters
      .filter((character) => selectedCharacterIdSet.has(character.id))
      .map((character) => {
        const points = character.points.filter(([, , season]) =>
          selectedSeasonValueSet.has(String(season)),
        );

        return {
          ...character,
          points,
          totalWordsSpoken: points.reduce(
            (total, [, wordsSpoken]) => total + wordsSpoken,
            0,
          ),
        };
      })
      .filter((character) => character.points.length > 0);
  }, [selectedCharacterIds, selectedSeasonValues]);

  function toggleSelectedCharacter(characterId: string) {
    setSelectedCharacterIds((currentIds) =>
      currentIds.includes(characterId)
        ? currentIds.filter((id) => id !== characterId)
        : [...currentIds, characterId],
    );
  }

  function toggleSelectedSeason(season: string) {
    setSelectedSeasonValues((currentSeasons) =>
      currentSeasons.includes(season)
        ? currentSeasons.filter((selectedSeason) => selectedSeason !== season)
        : [...currentSeasons, season],
    );
  }

  return (
    <main className="p-8">
      <div className="mb-4 flex flex-col items-center gap-2">
        <h1 className="font-title text-3xl">Dunderlines</h1>
        <h2 className="italic">That's what they said.</h2>
      </div>
      <div className="mx-auto mb-6 flex w-full max-w-2xl flex-wrap justify-end gap-2">
        <MultiSelectDropdown
          label="Characters"
          options={characterOptions}
          selectedValues={selectedCharacterIds}
          onToggle={toggleSelectedCharacter}
          onSelectAll={() => setSelectedCharacterIds(allCharacterIds)}
          onClear={() => setSelectedCharacterIds([])}
        />
        <MultiSelectDropdown
          label="Seasons"
          options={seasonOptions}
          selectedValues={selectedSeasonValues}
          onToggle={toggleSelectedSeason}
          onSelectAll={() => setSelectedSeasonValues(allSeasonValues)}
          onClear={() => setSelectedSeasonValues([])}
        />
      </div>
      <div className="flex flex-col items-center">
        {visibleCharacters.map((character) => (
          <CharacterLine
            key={character.id}
            text={character.name}
            totalWordsSpoken={character.totalWordsSpoken}
            points={character.points}
          />
        ))}
        {visibleCharacters.length === 0 ? (
          <p className="mt-8 text-sm text-black/60">No lines to display.</p>
        ) : null}
      </div>
      <footer className="mx-auto mt-12 flex w-full max-w-2xl flex-col gap-2 border-t border-black/10 pt-5 text-sm text-black/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Made by{' '}
          <a
            className="font-medium text-black/65 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
            href="https://x.com/NicolasMilliard"
            rel="noreferrer"
            target="_blank"
          >
            Nicolas Milliard
          </a>
        </p>
        <RouteLink
          className="text-sm font-medium text-black/55 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
          to="credits"
        >
          Credits
        </RouteLink>
      </footer>
    </main>
  );
}
