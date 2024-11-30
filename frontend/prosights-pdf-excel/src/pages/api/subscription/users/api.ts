import { urls } from "@/config/urls";

export const userAuthAPI = async (user: any, token: string): Promise<any> => {
  const apiUrl = urls.apiBaseUrl + "/api/v1/users";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    // Save user ID to Redux
    const responseData = await response.json();
    const userId = responseData.user_id;
    if (userId) {
      localStorage.setItem("userId", userId);
      return userId;
    } else {
      console.error("User ID is undefined");
    }
  } else {
    console.error("Failed to store user info");
    return null;
  }
};
