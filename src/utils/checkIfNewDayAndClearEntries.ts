import { ref, get, set, remove } from "firebase/database";
import { db } from "@/firebase";

export const checkIfNewDayAndClearEntries = async (uid: string) => {
  const entriesRef = ref(db, `users/${uid}/entries`);
  const snapshot = await get(entriesRef);

  if (!snapshot.exists()) return;

  const entries = snapshot.val();
  const dateKey = new Date().toISOString().slice(0, 10); // e.g., "2025-05-21"
  const historyRef = ref(db, `users/${uid}/history/${dateKey}`);

  await set(historyRef, entries); // Archive entries to history
  // Delete original entries
  await remove(entriesRef);
};
