import { db, auth } from "@/firebase";
import { ref, onValue } from "firebase/database";
import { calculateCleanPoints } from "@/utils/calculateCleanPoints";
import { useEffect, useState } from "react";

type Entry = {
  key: string;
  text: string;
  timestamp: number;
  tier?: number;
};

export default function EntrySummary() {
  const [_todayEntries, setTodayEntries] = useState<Entry[]>([]);
  const [cleanPoints, setCleanPoints] = useState(0);
  const [cheatCounts, setCheatCounts] = useState({ t1: 0, t2: 0, t3: 0 });

  const today = new Date().toLocaleDateString();
  const focusHours = 4.5;
  const punishmentsQueued = 1;

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const entriesRef = ref(db, `users/${uid}/entries`);
    const cheatsRef = ref(db, `users/${uid}/cheats`);

    // Live updates for entries and cheats
    const unsubEntries = onValue(entriesRef, (entriesSnap) => {
      const entryData = entriesSnap.exists() ? entriesSnap.val() : {};

      onValue(cheatsRef, (cheatsSnap) => {
        const cheatData = cheatsSnap.exists() ? cheatsSnap.val() : {};

        const combined: Entry[] = [
          ...Object.entries(entryData).map(([key, item]: [string, any]) => ({
            ...item,
            key,
            tier: 0,
          })),
          ...Object.entries(cheatData).map(([key, item]: [string, any]) => ({
            ...item,
            key,
            tier: item.tier ?? 1,
          })),
        ];

        combined.sort((a, b) => b.timestamp - a.timestamp);
        setTodayEntries(combined);
        setCleanPoints(calculateCleanPoints(combined));

        let t1 = 0, t2 = 0, t3 = 0;
        for (const entry of combined) {
          if (entry.tier === 1) t1++;
          else if (entry.tier === 2) t2++;
          else if (entry.tier === 3) t3++;
        }
        setCheatCounts({ t1, t2, t3 });
      });
    });

    return () => unsubEntries(); // clean up Firebase listener
  }, []);

  return (
    <div className="p-4 bg-yellow-100 rounded text-sm text-black">
      <h3 className="text-lg font-semibold">Today’s Summary ({today})</h3>
      <ul className="list-disc list-inside text-sm text-muted-foreground">
        <li>✅ Clean Points: {cleanPoints}</li>
        <p>⚠️ Tier 1 Cheats: <strong>{cheatCounts.t1}</strong></p>
        <p>❌ Tier 2 Cheats: <strong>{cheatCounts.t2}</strong></p>
        <p>💥 Tier 3 Cheats: <strong>{cheatCounts.t3}</strong></p>
        <li>🧠 Focus Hours Logged: {focusHours}</li>
        <li>⏱️ Punishments Queued: {punishmentsQueued}</li>
      </ul>
    </div>
  );
}