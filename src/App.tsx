import { CharacterLine } from './components/CharacterLine';
import { officeCharacters } from './data/officeCharacters';

function App() {
  return (
    <main className="p-8">
      <div className="flex flex-col items-center gap-3">
        {officeCharacters.map((character) => (
          <CharacterLine
            key={character.id}
            text={character.name}
            points={character.points}
          />
        ))}
      </div>
    </main>
  );
}

export default App;
