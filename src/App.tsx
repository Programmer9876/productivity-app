import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, db } from "@/firebase";

import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import Login from "@/components/Login";
import {checkIfNewDayAndClearEntries} from "@/utils/checkIfNewDayAndClearEntries"
import SignInPage from "@/components/SignInPage";

function App() {
  const [user, setUser] = useState<any>(null);
  const [showSignInPage, setShowSignInPage] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hideEntries, setHideEntries] = useState(false);



  useEffect(() => {
    // watch for auth changes — user login/logout
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

    if (!firebaseUser) {
      setChecking(false); // done checking
      return;
    }

    const uid = firebaseUser.uid;
    //get today and last signin
    const today = new Date().toISOString().slice(0, 10);
    const lastSignInRef = ref(db, `users/${uid}/lastSignIn`);
    //if last sign-in not today log out
    try {
      const snapshot = await get(lastSignInRef);
      const lastSignIn = snapshot.val();

      if (lastSignIn !== today) {
        setShowSignInPage(true); // triggers SignInPage
      }
    } catch (error) {
      console.error("Error checking lastSignIn:", error);
    } finally {
      setChecking(false); // ensures app renders once decision is made
    }
  });

  return () => unsubscribe(); // clean up listener
  }, []);
  //handle daily signin
  const handleDailySignIn = async () => {
    if (!user) return;
  
    const uid = user.uid;
    const today = new Date().toISOString().slice(0, 10);

    await checkIfNewDayAndClearEntries(uid);

    await set(ref(db, `users/${uid}/lastSignIn`), today);
    setHideEntries(true); // visually clear the log
    setShowSignInPage(false);
  };
  if (checking) return null;
  if (!user) return <Login />;
  if (showSignInPage) {
    return <SignInPage onSignedIn={handleDailySignIn} />;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* top bar with title and logout */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">CommitLog</h1>
        <button
        onClick={() => auth.signOut()}
        className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
        </button>
      </div>

      {/* form to add entry */}
      <EntryForm />

      {/* list of entries */}
      <EntryList hide={hideEntries} />
    </div>
  );
}

export default App;
