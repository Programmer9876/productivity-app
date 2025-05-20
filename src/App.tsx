import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase"; // cleaner absolute import
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import Login from "@/components/Login";

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // watch for auth changes — user login/logout
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // clean up listener
  }, []);

  if (!user) {
    // show login screen if not authenticated
    console.log("User not logged in — rendering login screen");
    return <Login />;
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
      <EntryList />
    </div>
  );
}

export default App;
