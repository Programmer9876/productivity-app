import { Card } from "@/components/ui/card";
import BarChartComponent from "@/components/BarChartComponent";
import EntrySummary from "../components/EntrySummary";
import { ProgressBar } from "@/components/ProgressBar";
import StreakTracker from "@/components/StreakTracker";
import { getDatabase, ref, DataSnapshot, onValue} from "firebase/database";
import { auth } from "@/firebase";
import { useEffect, useState } from "react";


export function countUserEntries() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not signed in");

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!uid) return;
    const r = ref(getDatabase(), `users/${uid}/entries`);
    const unsub = onValue(r, (snap: DataSnapshot) => {
      const v = snap.val() as Record<string, unknown> | null;
      setCount(v ? Object.keys(v).length : 0);    });
    return () => unsub();
  }, [uid]);

  return count;// direct children under entries
}


export default function Dashboard() {

  // You can replace these mock values with actual logic later
 
  const entriesToday = countUserEntries();
  const entryGoal = 4;

  return (
    <div className="space-y-6">
      {/* Summary and Quote */}
      <Card className="p-4 space-y-4">
      <div className="text-sm text-blue-800 bg-blue-50 rounded-xl p-4 shadow">
          You are doing good keep it up!
        </div>
        <EntrySummary />

        <div className="p-4 space-y-6">
      <StreakTracker />
      {/* Future: Entry stats, cheat log, punishment generator */}
    </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">
            🎯 Daily Goal: {entryGoal} entries
          </p>
          <ProgressBar current={entriesToday} goal={entryGoal} />
        </div>
      </Card>

      {/* Bar Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">7-Day Log Overview</h2>
        <BarChartComponent />
      </Card>
    </div>
  );
}