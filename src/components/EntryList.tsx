import { useEffect, useState, } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, remove } from "firebase/database";
import { Trash2 } from "lucide-react";


export interface Entry {
  key: string;
  text: string;
  timestamp: number;
  tier?: number; // 0 = clean entry, >0 = cheat
  source: "entries" | "cheats";
}

export interface Cheat extends Entry {
  tier: 1 | 2 | 3; // required and restricted
}

  export default function EntryList() {
    const [entries, setEntries] = useState<Entry[]>([]);
   

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    
    if (!userId) return;

    const entriesRef = ref(db, `users/${userId}/entries`);
    const cheatsRef = ref(db, `users/${userId}/cheats`);

    const handleSnapshot = (entriesData: any, cheatsData: any) => {
    const all: Entry[] = [];

      if (entriesData) {
          all.push(
            ...Object.entries(entriesData).map(([key, item]: [string, any]) => ({
              ...item,
              key,
              tier: 0,
              source: "entries",
            }))
          );
        }

        if (cheatsData) {
          all.push(
            ...Object.entries(cheatsData).map(([key, item]: [string, any]) => ({
              ...item,
              key,
              tier: item.tier ?? 1,
              source: "cheats",
            }))
          );
        }

      all.sort((a, b) => b.timestamp - a.timestamp);
      setEntries(all);
    };

    const unsubEntries = onValue(entriesRef, (entriesSnap) => {
      const entriesData = entriesSnap.val();

      const unsubCheats = onValue(cheatsRef, (cheatsSnap) => {
        const cheatsData = cheatsSnap.val();
        handleSnapshot(entriesData, cheatsData);
      });

      // Cleanup cheats listener inside entries listener
      return () => unsubCheats();
    });

    return () => unsubEntries(); // cleanup entries listener
  }, []);

  // Only deletes from /entries and/cheats
  const handleDelete = async (key: string, source: "entries" | "cheats") => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    await remove(ref(db, `users/${userId}/${source}/${key}`));
  };

  return (
    <ul className="space-y-4">
      {entries.map((e) => (
        <li
          key={e.key}
          className="flex justify-between items-start bg-gray-100 border border-gray-300 p-3 rounded shadow-sm"
        >
          <div>
            <div>
              {e.text}
              {e.tier > 0 && (
                <span className="text-red-600 ml-2">[Tier {e.tier} Cheat]</span>
              )}
              
            </div>
            <div className="text-xs text-gray-500">
              {new Date(e.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => handleDelete(e.key, e.source)}
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