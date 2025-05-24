import { useState } from "react";
import { db, auth } from "../firebase";
import { ref, push, set } from "firebase/database";

export default function EntryForm() {
  const [entry, setEntry] = useState("");
  const [showCheatTierSelector, setShowCheatTierSelector] = useState(false);
  const [cheatTier, setCheatTier] = useState(1);


  // Handle form submission — push new entry to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim()) return;

  
    const userId = auth.currentUser?.uid;
    const entriesRef = ref(db, `users/${userId}/entries`);
    const newEntryRef = push(entriesRef);
    await set(newEntryRef, {
      key: newEntryRef.key,     // store the key with entry
      text: entry,              // entry content
      timestamp: Date.now(),    // creation time
    });

    setEntry(""); // clear input field
  };
  const handleAddCheat = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!entry.trim()) return;

  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const cheatsRef = ref(db, `users/${userId}/cheats`);
  const newCheatRef = push(cheatsRef);
  await set(newCheatRef, {
    key: newCheatRef.key,
    text: entry,
    tier: cheatTier,
    timestamp: Date.now(),
  });

  setEntry("");              // clear input field
  setCheatTier(1);           // reset tier selector
  setShowCheatTierSelector(false); // hide cheat popup
};



  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {/* input area for user log */}
      <textarea
        className="w-full border p-3 rounded resize-none"
        placeholder="Log your commit..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      {/* submit button */}
      <button
        type="submit"
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Entry
      </button>
        <button
      className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        type="button"
      onClick={() => setShowCheatTierSelector((prev) => !prev)}
    >
      Add Cheat
    </button>
    {showCheatTierSelector && (
  <div className="mt-2">
    <select
      className="w-full p-2 border rounded mb-2"
      value={cheatTier}
      onChange={(e) => setCheatTier(Number(e.target.value))}
    >
      <option value={1}>Tier 1 - Minor Slip</option>
      <option value={2}>Tier 2 - Moderate Violation</option>
      <option value={3}>Tier 3 - Serious Breach</option>
    </select>
    <button
      className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
      onClick={handleAddCheat}
    >
      Confirm Cheat
    </button>
  </div>
)}
      </form>
  );
}
