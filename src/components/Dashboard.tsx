import { Card } from "@/components/ui/card";
import BarChartComponent from "@/components/BarChartComponent";
import EntrySummary from "../components/EntrySummary";
import { ProgressBar } from "@/components/ProgressBar";

export default function Dashboard() {

  // You can replace these mock values with actual logic later
  const currentStreak = 3;
  const longestStreak = 7;
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

        <div className="text-sm text-muted-foreground space-y-1">
          <p>📅 Current Streak: {currentStreak} days</p>
          <p>🔥 Longest Streak: {longestStreak} days</p>
          <p>📈 Avg Entries: 2.7/day</p>
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