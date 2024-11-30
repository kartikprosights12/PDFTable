import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSubscriptionRequest, initiateSubscriptionRequest } from "../subscription/reducer";
import { RootState } from "@/redux/Store";

const SubscriptionComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state: RootState) => state.subscription.subscriptionStatus
  );
  const loading = useSelector((state: RootState) => state.subscription.isLoading);
  const hasCheckedSubscription = useSelector(
    (state: RootState) => state.subscription.hasCheckedSubscription
  );
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    // Perform subscription check only if the user is authenticated and subscription status hasn't been checked
    if (userId && !hasCheckedSubscription) {
      dispatch(checkSubscriptionRequest({ userId }));
    }
  }, [dispatch, hasCheckedSubscription, userId]);

  // Handle "Buy Subscription" button click
  const handleBuySubscription = () => {
    if (userId) {
      dispatch(initiateSubscriptionRequest({ userId }));
    }
  };

  // Show loading state while subscription status is being checked
  if (loading || !hasCheckedSubscription) {
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
            Checking subscription status...
          </h2>
          <p className="text-gray-600">Please wait while we verify your subscription status.</p>
        </div>
      </div>
    );
  }

  // Show subscription required screen if the user doesn't have an active subscription
  if (!subscriptionStatus) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md px-6 py-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription Required</h2>
          <p className="text-gray-600 mb-4">
            Please subscribe to access this feature. If you believe this is an error, contact
            support.
          </p>
          <button
            onClick={handleBuySubscription}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Buy Subscription
          </button>
        </div>
      </div>
    );
  }

  // Render children if the subscription is active
  return <>{children}</>;
};

export default SubscriptionComponent;
