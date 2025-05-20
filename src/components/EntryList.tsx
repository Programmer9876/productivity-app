import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import { Trash2 } from "lucide-react";

interface Entry {
  key: string;
  text: string;
  timestamp: number;
}

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    // listen to Firebase for real-time updates
    const entriesRef = ref(db, "entries");

    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded: Entry[] = Object.entries(data).map(([key, item]) => ({
          ...(item as Entry),
          key, // ensure key is preserved
        }));
        loaded.sort((a, b) => b.timestamp - a.timestamp); // newest first
        setEntries(loaded);
      } else {
        setEntries([]); // no entries
      }
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, []);

  // handle delete button click
  const handleDelete = async (key: string) => {
    await remove(ref(db, `entries/${key}`));
  };

  return (
    <ul className="space-y-4">
      {entries.map((e) => (
        <li
          key={e.key}
          // flex layout: left for text/timestamp, right for delete
          className="flex justify-between items-start bg-gray-100 border border-gray-300 p-3 rounded shadow-sm"
        >
          <div>
            {/* log content */}
            <div>{e.text}</div>
            {/* timestamp, formatted */}
            <div className="text-xs text-gray-500">
              {new Date(e.timestamp).toLocaleString()}
            </div>
          </div>
          <button
          onClick={() => handleDelete(e.key)}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
        >
          <Trash2 size={16} />
          Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
