interface Props {
    onSignedIn: () => void;
  }
  
  export default function SignInPage({ onSignedIn }: Props) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h1 className="text-2xl font-bold mb-4">Sign In to Start Logging</h1>
        <button
          onClick={onSignedIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In for Today
        </button>
      </div>
    );
  }
  