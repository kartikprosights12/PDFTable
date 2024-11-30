import { Provider, useSelector } from "react-redux";
import store from "../redux/Store";
import UploadContainer from "../features/upload/container";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionComponent from "../features/subscription/index";
import { RootState } from "@/redux/Store";
import { useAuth0 } from "@auth0/auth0-react";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {isLoading, loginWithRedirect } = useAuth0(); // Fetch user data from Auth0
  const userId = useSelector((state: RootState) => state.user.userId);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
          <div className="max-w-xl w-full bg-white rounded-lg shadow-md px-6 py-8 text-center">
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
              Please wait while we retrieve your account details.
            </p>
          </div>
        </div>
      ); // Wait for authentication to load
  }
  if (!userId) {
    loginWithRedirect() // Wait for userId to be set
  }

  return <>{children}</>;
};

const Home: React.FC = () => (
  <Provider store={store}>
    <AppInitializer>
      <div className="min-h-screen bg-gray-100">
        <main className="p-6 flex flex-col items-center">
        
          <AuthGuard>
            <SubscriptionComponent>
              <UploadContainer />
            </SubscriptionComponent>
          </AuthGuard>
        </main>
      </div>
    </AppInitializer>
  </Provider>
);

export default Home;
