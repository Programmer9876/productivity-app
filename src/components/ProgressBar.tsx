export function ProgressBar({ current, goal }: { current: number; goal: number }) {
    const percent = Math.min((current / goal) * 100, 100);
  
    return (
      <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }