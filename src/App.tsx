// src/App.tsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

interface Entry {
  text: string;
  timestamp: number;
}

function App() {
  const [entry, setEntry] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);

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
  //react hook
  useEffect(() => {
    //create reference to the enteries
    const entriesRef = ref(db, "entries");
    //starts listening  navagate away when component gone
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      //get actual json object from firebase
      
      const data = snapshot.val();
      const loaded: Entry[] = [];

      if (data) {
        //loop through starting with newest entry
        Object.values(data).forEach((item) => {
          //newest is first in
          loaded.push(item as Entry);
        });

        // Sort newest to last and oldest to first
        loaded.sort((a, b) => b.timestamp - a.timestamp);
      }
      //update entries 
      setEntries(loaded);
    });
    //close the listener
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">What did you do today?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="e.g. Ran 3 miles, read 20 pages"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log Entry
        </button>
      </form>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Recent Entries:</h2>
      <ul className="space-y-2">
        {entries.map((e, i) => (
          // for each element give key to react to unique track and show actual entry text
          // as well as show timestamp
          <li key={i} className="border p-2 rounded bg-gray-100">
            <div>{e.text}</div>
            <div className="text-xs text-gray-500">
              {new Date(e.timestamp).toLocaleString()}
               
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;