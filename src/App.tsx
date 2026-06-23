import { CharacterLine } from './components/CharacterLine';
import { officeCharacters, toLinePoints } from './data/officeCharacters';

function App() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">Dunderlines</h1>
      <div className="mt-8 flex flex-col gap-3">
        {officeCharacters.map((character) => (
          <CharacterLine
            key={character.id}
            text={character.name}
            points={toLinePoints(character.episodes)}
          />
        ))}
      </div>
    </main>
  );
}

export default App;
