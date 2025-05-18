import { useState } from "react";
import { db } from "./firebase";
import { ref, push } from "firebase/database";

function App() {
  const [entry, setEntry] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!entry.trim()) return;

    const entriesRef = ref(db, "entries");
    push(entriesRef, {
      text: entry,
      timestamp: Date.now(),
    });

    setEntry("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">What did you do today?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="e.g. Studied DSA for 2 hours"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log Entry
        </button>
      </form>
    </div>
  );
}

export default App;