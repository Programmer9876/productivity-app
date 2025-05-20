/// <reference types="firebase" />
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue, set, remove } from "firebase/database";
import { Trash2 } from "lucide-react";


interface Entry {
  key: string;
  text: string;
  timestamp: number;
}

function App() {
  const [entry, setEntry] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    //prevent reload on submit
    e.preventDefault();
    //prevent empty entry
    if (!entry.trim()) return;
    //create reference to entry path in database
    const entriesRef = ref(db, "entries");
    const newEntryRef = push(entriesRef);
    set(newEntryRef, {
      key: newEntryRef.key,
      text: entry,
      timestamp: Date.now(),
    });


    setEntry("");
  };
  const handleDelete = (key: string) => {
    const entryRef = ref(db, `entries/${key}`);
    remove(entryRef);
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
        Object.entries(data).forEach(([key, value]) => {
          //newest is first in
          const entryData = value as Omit<Entry, 'key'>; // ensure it has text + timestamp
          // copies all properties from entryData into a new object and then adds/overwrites the key field
          loaded.push({ ...entryData, key});
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
    /**min-h-screen to vertical center bg-gray-50 for light gray flex items-center justify-center to center inner content vertically and horizontally p-3 for edge padding
    w-full max-w-md for full width cap at 640px bg white for contrast white backgrond shadow-md for sbtle box showdow for elevation 
    text-2x1 font-bold big bold title mb-4 for margin
    flex input and button sit side by side gap 2 add spacing between them mb-6 margin below the whole form
    **/
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
      <div className="flex flex-col items-center w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">What did you do today?</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full mb-6">
          <input
          //type of input
            type="text"
            //simple border with soft corners, padding and take full space
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="e.g. Walked 3 miles"
          />
          <button
          // blue button white text with padding soft edges 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
            Log
          </button>
        </form>
        <h2 className="text-lg font-semibold mb-2">Recent Entries:</h2>
        <ul className="space-y-3">
          {entries.map((e, i) => (
            <li
            //list entries with a simple section header flex justify-between separates log text and delete button items center allign vertical and rest for light box
              key={i}
              className="flex justify-between items-start bg-gray-100 border border-gray-300 p-3 rounded-lg shadow w-[350px]"
              >
              <div>
                <div>{e.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(e.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                //delete button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"

                onClick={() => handleDelete(e.key!)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </li>
          ))}
        </ul>
        </div>
        </div>
      </div>
  );
}

export default App;