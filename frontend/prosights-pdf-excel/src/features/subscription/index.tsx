import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkSubscriptionRequest } from "../subscription/reducer";
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
    if (userId && !hasCheckedSubscription) {
      console.log("Dispatching checkSubscriptionRequest...", userId);
      dispatch(checkSubscriptionRequest(userId));
    }
  }, [dispatch, hasCheckedSubscription, userId]);

  if (loading) {
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
            Loading subscription status...
          </h2>
          <p className="text-gray-600">
            Please wait while we check your subscription status.
          </p>
        </div>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md px-6 py-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Subscription Required
          </h2>
          <p className="text-gray-600">
            Please subscribe to access this feature. If you believe this is an
            error, contact support.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionComponent;
