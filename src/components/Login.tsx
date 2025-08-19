import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import { auth } from "@/firebase";




export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);    
    const handleResetPassword = async () => {
  setError?.("");              
  try {
    const addr = email.trim();
    if (!addr) {
      setError?.("Enter your email first.");
      return;
    }
    await sendPasswordResetEmail(auth, addr, {
      // After user resets on Firebase-hosted page, they'll be redirected here:
      url: "https://productivity-app-xi-beryl.vercel.app//login?reset=done",
    });
    await sendPasswordResetEmail(auth, addr);
    setError?.("Password reset email sent.");
  } catch (err: any) {
    const map: Record<string, string> = {
      "auth/missing-email": "Enter your email.",
      "auth/invalid-email": "Invalid email address.",
      "auth/user-not-found": "No account with that email.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
    };
    setError?.(map[err?.code ?? ""] ?? "Could not send reset email.");
    console.error("reset error:", err);
  }
};
    //send email and passward to Firebase authentication and validates or throw otherwise
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        console.log("Trying login with:", email, password); //debug
        try {
            await signInWithEmailAndPassword(auth, email, password);

          // success — user is now signed in
        } catch (err) {
          if (! isSignUp)
          {
             console.error("Login failed:", err);
             setError("Invalid credentials");
          }         
        }
        //sign up
        if (isSignUp) {
          if (password.length < 6) {
               setError("Password must be at least 6 characters.");
          }
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      };


  return (
    //login elements
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {isSignUp ? "Create Account" : "Sign In"}
        </h2>
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
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
      type="button"
      onClick={handleResetPassword}
      className="mt-2 w-full text-sm text-blue-600 underline"
      >
  Forgot password?
</button>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
      >
        {isSignUp ? "Back to Sign In" : "Create Account"}
      </button>
    </div>
  );
}




