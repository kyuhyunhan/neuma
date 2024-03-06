import { atom, useAtom } from "jotai";

const countAtom = atom(0);
// const countryAtom = atom("Japan");
// const citiesAtom = atom(["Tokyo", "Kyoto", "Osaka"]);
// const mangaAtom = atom({
//   "Dragon Ball": 1984,
//   "One Piece": 1997,
//   Naruto: 1999,
// });
function App() {
  // const [count, setCount] = useState(0);
  const [count, setCount] = useAtom(countAtom);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
