import { Card } from "@/components/ui/card";
import BarChartComponent from "@/components/BarChartComponent";
import EntrySummary from "../components/EntrySummary";
import { ProgressBar } from "@/components/ProgressBar";
import StreakTracker from "@/components/StreakTracker";



export default function Dashboard() {

  // You can replace these mock values with actual logic later
  const entriesToday = 3;
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