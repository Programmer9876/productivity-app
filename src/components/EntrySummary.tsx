export default function EntrySummary() {
  // Mock data – replace with real data from Firebase later
  const today = new Date().toLocaleDateString();
  const cleanPoints = 3;
  const cheats = 1;
  const focusHours = 4.5;
  const punishmentsQueued = 1;

  return (
    <div className="p-4 bg-yellow-100 rounded text-sm text-black">
      <h3 className="text-lg font-semibold">Today’s Summary ({today})</h3>
      <ul className="list-disc list-inside text-sm text-muted-foreground">
        <li>✅ Clean Points: {cleanPoints}</li>
        <li>⚠️ Cheats: {cheats}</li>
        <li>🧠 Focus Hours Logged: {focusHours}</li>
        <li>⏱️ Punishments Queued: {punishmentsQueued}</li>
      </ul>
    </div>
  );
}
