// src/components/AuthGuard.tsx
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: router.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="text-center">
          <svg
            className="animate-spin w-16 h-16 text-blue-500 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <h1 className="text-xl font-semibold text-gray-800">Authenticating...</h1>
          <p className="text-gray-600 mt-2">
            Please wait while we verify your credentials.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering protected content while redirecting
  }

  return <>{children}</>;
};

export default AuthGuard;
