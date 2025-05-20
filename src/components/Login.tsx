import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";




export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    //send email and passward to Firebase authentication and validates or throw otherwise
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        console.log("Trying login with:", email, password); //debug
        try {
            await signInWithEmailAndPassword(auth, email, password);

          // success — user is now signed in
        } catch (err) {
          console.error("Login failed:", err);
          alert("Invalid credentials");
        }
      };


  return (
    //login elements
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}