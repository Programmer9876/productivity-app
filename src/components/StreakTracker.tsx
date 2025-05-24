import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { auth, db } from "@/firebase";

type Entry = {
  tier: number;
  task: string;
};

type HistoryData = {
  [date: string]: {
    entries: Entry[];
  };
};

type StreakStats = {
  currentStreak: number;
  longestStreak: number;
  stats: { date: string; hasEntries: boolean }[];
};

const StreakTracker = () => {
  const user = auth.currentUser;
  const [streaks, setStreaks] = useState<StreakStats>({
    currentStreak: 0,
    longestStreak: 0,
    stats: [],
  });
  const [todayHasEntries, setTodayHasEntries] = useState(false); //  not undefined

  const checkTodayEntries = async (uid: string): Promise<boolean> => {
    const snapshot = await get(ref(db, `users/${uid}/entries`));
    const data = snapshot.val();

    // Log what's really there
    console.log("📦 Raw entries from Firebase:", data);

    // Return true if there's at least one entry object
    return !!data && Object.keys(data).length > 0;
    };


  useEffect(() => {
    const fetchUserHistory = async (uid: string): Promise<HistoryData> => {
  const snapshot = await get(ref(db, `users/${uid}/history`));
  const raw = snapshot.exists() ? snapshot.val() : {};
  

  const normalized: HistoryData = {};

  for (const [date, entryMap] of Object.entries(raw)) {
    const entries = Object.values(entryMap as { [key: string]: Entry });
    normalized[date] = { entries };
  }

  return normalized;
};

    const getDailyStreakStats = (history: HistoryData, todayHasEntries: boolean): StreakStats => {
      const sortedDates = Object.keys(history).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
        console.log("📅 Sorted Dates:", sortedDates);

    let streakCounter = 0;
        let longestStreak = 0;
        let currentStreak = 0;
      const stats: { date: string; hasEntries: boolean }[] = [];
      

      for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        const entries = history[date]?.entries ?? [];
        const hasEntries = entries.length > 0;
        stats.push({ date, hasEntries });
            console.log(`🔍 ${date} → ${hasEntries ? " has entries" : " no entries"}`);

        if (!hasEntries) {
          streakCounter = 0;
          continue;
        }

        if (i === 0) {
          streakCounter = 1;
        } else {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(date);
            const diff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
            streakCounter++;
            } else {
                        console.log(`Break in streak between ${sortedDates[i - 1]} and ${date}`);
                streakCounter = 0;
            } 
        }
        currentStreak = todayHasEntries ? streakCounter + 1 : 0;
        longestStreak = Math.max(longestStreak, currentStreak);
                console.log(`currentStreak: ${streakCounter}, maxStreak: ${longestStreak}`);


      }
    

      return { currentStreak, longestStreak, stats };
    };

    if (user) {
      Promise.all([
      fetchUserHistory(user.uid),
      checkTodayEntries(user.uid)
      
        ]).then(([data, hasToday]) => {
        const result = getDailyStreakStats(data, hasToday);
        console.log("checkTodayEntries returned:", hasToday);
        setTodayHasEntries(hasToday); // <-- This was likely missing

        setStreaks(result);
    });
    }
  }, [user]);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-bold text-xl mb-2">🔥 Streaks</h2>
      <p>Current streak: <strong>{streaks.currentStreak}</strong> days</p>
      <p>Longest streak: <strong>{streaks.longestStreak}</strong> days</p>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-1">📅 Daily Breakdown</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {(() => {
                const logs = [];

                // Step 1: Past 6 days (D-6 to D-1)
                for (let i = 6; i >= 1; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split("T")[0];
                const match = streaks.stats.find((d) => d.date === dateStr);
                const hasEntry = match?.hasEntries ?? false;
                logs.push(
                    <li key={dateStr}>
                    {dateStr}: {hasEntry ? " Entry logged" : " No entry"}
                    </li>
                );
                }

                // Step 2: Today (D-0)
                const today = new Date().toISOString().split("T")[0];
                console.log("🚨 DEBUG: today =", today, "todayHasEntries =", todayHasEntries);
                logs.push(
                <li key={today}>
                    {today}: {todayHasEntries ? " Entry logged" : " No entry"}
                </li>
                );

                return logs;
            })()}
        </ul>
      </div>
    </div>
  );
};

export default StreakTracker;