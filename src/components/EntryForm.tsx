import { useState } from "react";
import { db } from "../firebase";
import { ref, push, set } from "firebase/database";

export default function EntryForm() {
  const [entry, setEntry] = useState("");

  // Handle form submission — push new entry to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim()) return;

    const entriesRef = ref(db, "entries");
    const newEntryRef = push(entriesRef); // generate unique key

    await set(newEntryRef, {
      key: newEntryRef.key,     // store the key with entry
      text: entry,              // entry content
      timestamp: Date.now(),    // creation time
    });

    setEntry(""); // clear input field
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
    </form>
  );
}
