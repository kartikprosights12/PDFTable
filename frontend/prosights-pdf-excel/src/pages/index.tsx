// src/pages/index.tsx
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store, { AppDispatch } from "../redux/Store";
import UploadContainer from "../features/upload/container";
import AuthGuard from "@/components/AuthGuard";
import SubscriptionComponent from "../features/subscription/index";
import { RootState } from "@/redux/Store";
import { setUserId } from "@/redux/UserSlice";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    // Fetch userId (replace this with actual logic, e.g., API call or localStorage)
    const storedUserId = localStorage.getItem("userId") || "185e3b88-631c-4649-b94e-0a9c5a35ccc0"; // Default userId for testing

    if (storedUserId) {
      dispatch(setUserId({ userId: storedUserId })); // Set userId in Redux store
    }
  }, [dispatch]);

  if (!userId) {
    return <div>Loading user information...</div>; // Wait for userId to be set
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
