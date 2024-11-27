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
    return <div>Loading...</div>; // You can customize this to show a spinner
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering protected content while redirecting
  }

  return <>{children}</>;
};

export default AuthGuard;
