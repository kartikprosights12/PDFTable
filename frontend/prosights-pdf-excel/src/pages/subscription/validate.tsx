import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "@/config/urls";

const ValidateSubscriptionPage: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const apiBaseUrl = urls.apiBaseUrl;

  const [validationResult, setValidationResult] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) return;

    const validateSession = async () => {
      try {
        const userId = "185e3b88-631c-4649-b94e-0a9c5a35ccc0"; // Replace with actual user ID
        const response = await axios.post(apiBaseUrl + "/api/v1/users/subscriptions/validate", {
          session_id,
          user_id: userId,
        });
        console.log("response", response);
        if (response.data.status === "active") {
          setValidationResult("Subscription is active.");
          router.push("/");
        } else {
          setValidationResult("Subscription is inactive or invalid.");
        }
      } catch (error: any) {
        console.error("Failed to validate session:", error.message || error);
        setValidationResult("Error validating session.");
      }
    };

    validateSession();
  }, [session_id, apiBaseUrl, router]);

  if (!session_id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-600">Invalid Session</h1>
          <p className="mt-2 text-gray-600">Please provide a valid session ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-700">Validate Subscription</h1>
        <p className="mt-4 text-gray-600">
          {validationResult || (
            <span className="flex items-center">
              <svg
                className="animate-spin mr-2 h-5 w-5 text-blue-500"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 000 8h-4a8 8 0 01-4-4z"
                ></path>
              </svg>
              Validating subscription session...
            </span>
          )}
        </p>

        {validationResult && (
          <div
            className={`mt-6 px-4 py-3 rounded-md ${
              validationResult === "Subscription is active."
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {validationResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidateSubscriptionPage;
