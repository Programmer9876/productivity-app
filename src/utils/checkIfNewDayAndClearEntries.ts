import { ref, get, set, remove } from "firebase/database";
import { auth, db } from "@/firebase";

export const checkIfNewDayAndClearEntries = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const todayStr = new Date().toISOString().split("T")[0];

  const lastDateRef = ref(db, `users/${uid}/lastActiveDate`);
  const entriesRef = ref(db, `users/${uid}/entries`);
  const cheatsRef = ref(db, `users/${uid}/cheats`);
  const historyRef = ref(db, `users/${uid}/history/${todayStr}`);

  // Get last active date
  const lastDateSnap = await get(lastDateRef);
  const lastDate = lastDateSnap.val();

  if (lastDate === todayStr) return; // still same day

  // Load current entries + cheats
  const [entriesSnap, cheatsSnap] = await Promise.all([
    get(entriesRef),
    get(cheatsRef),
  ]);

  const entries = entriesSnap.exists() ? entriesSnap.val() : {};
  const cheats = cheatsSnap.exists() ? cheatsSnap.val() : {};

  const combined = { ...entries, ...cheats };

  if (Object.keys(combined).length > 0) {
    await set(historyRef, combined);
  }

  // Clear current day logs
  await remove(entriesRef);
  await remove(cheatsRef);
  await set(lastDateRef, todayStr);

  console.log("✅ Archived to history and reset entries/cheats");
};