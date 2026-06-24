import { CharacterLine } from './components/CharacterLine';
import { officeCharacters } from './data/officeCharacters';

function App() {
  return (
    <main className="p-8">
      <div className="flex flex-col gap-2 items-center mb-4">
        <h1 className="font-title text-3xl">Dunderlines</h1>
        <h2 className="italic">That's what they said.</h2>
      </div>
      <div className="flex flex-col items-center">
        {officeCharacters.map((character) => (
          <CharacterLine
            key={character.id}
            text={character.name}
            totalWordsSpoken={character.totalWordsSpoken}
            points={character.points}
          />
        ))}
      </div>
    </main>
  );
}

export default App;
