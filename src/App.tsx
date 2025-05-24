import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, db } from "@/firebase";

import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import Login from "@/components/Login";
import {checkIfNewDayAndClearEntries} from "@/utils/checkIfNewDayAndClearEntries"
import SignInPage from "@/components/SignInPage";
import Dashboard from "@/components/Dashboard";

function App() {
  const [user, setUser] = useState<any>(null);
  const [showSignInPage, setShowSignInPage] = useState(false);
  const [checking, setChecking] = useState(true);
  const quotes = [
    "Every log is a step forward.",
    "Consistency beats intensity.",
    "Log it or lose it.",
    "Small wins compound.",
    "Discipline > motivation.",
  ];
  
  useEffect(() => {

    // watch for auth changes — user login/logout
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

    if (!firebaseUser) {
      setUser(null);
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

    await checkIfNewDayAndClearEntries();

    await set(ref(db, `users/${uid}/lastSignIn`), today);
    setShowSignInPage(false);
  };
  if (checking) return null;
  if (!user) return <Login />;
  if (showSignInPage) return <SignInPage onSignedIn={handleDailySignIn} />;
  
  function RotatingQuote() {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex(i => (i + 1) % quotes.length);
      }, 5000); // Change every 5 seconds
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <p className="text-sm italic text-gray-500 absolute left-1/2 transform -translate-x-1/2">
        {quotes[index]}
      </p>
    );
  }
  

  return (
    
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="w-full bg-gray-100">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
    {/* Left: Title */}
    <h1 className="text-xl font-bold text-gray-900">CommitLog</h1>

    {/* Center: Motivational Quote */}
    <RotatingQuote />


    {/* Right: Logout Button */}
    <button
      onClick={() => auth.signOut()}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow ml-auto"
    >
      Logout
    </button>
  </div>
</header>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      

        {/* LEFT: Entire dashboard panel (already has chart + stats + quote) */}
        <Dashboard />

        {/* RIGHT: Entry form and list */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">New Entry</h3>
            <EntryForm />
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Today’s Logs</h3>
            <EntryList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
