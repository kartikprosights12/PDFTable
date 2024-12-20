// src/pages/auth.tsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUserId } from "@/redux/UserSlice";
import { userAuthAPI } from "./api/subscription/users/api";

const AuthPage: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();
  const dispatch = useDispatch(); // Redux dispatch

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated && user) {
        try {
          // Retrieve the token
          const token = await getAccessTokenSilently();
          // Call the backend API to save user info
          const getUserID = await userAuthAPI(user, token);
          dispatch(setUserId(getUserID));
          // Redirect to the main platform
           router.push("/");
        } catch (error) {
          console.error("Error during token retrieval or API call:", error);
        }
      }
    };

    handleAuth();
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
       <div className="text-center">
        <svg
          className="animate-spin mx-auto mb-6 w-12 h-12 text-blue-500"
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Loading user information...
        </h2>
        <p className="text-gray-600">
          Please wait while we retrieve your account details from pages/auth.tsx
        </p>
      </div>
    </div>
  ); // Show a loader while handling authentication
};

export default AuthPage;
