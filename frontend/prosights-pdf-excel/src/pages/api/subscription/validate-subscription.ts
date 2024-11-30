import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { urls } from "@/config/urls";

// API endpoint handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { session_id } = req.query;

  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    // Validate the Stripe session
    const response = await axios.get(
      `${urls.apiBaseUrl}/api/v1/subscription/session?session_id=${session_id}`
    );

    // Return session data
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error validating session:", error.message || error);
    return res.status(500).json({ error: "Failed to validate session" });
  }
}
