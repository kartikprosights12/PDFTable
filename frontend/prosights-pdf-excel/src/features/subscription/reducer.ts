import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  isLoading: boolean;
  subscriptionStatus: boolean;
  error: string | null;
  hasCheckedSubscription: boolean; // To track whether subscription check is complete
}

interface CheckSubscriptionPayload {
  userId: string;
}

const initialState: SubscriptionState = {
  isLoading: false,
  subscriptionStatus: false,
  error: null,
  hasCheckedSubscription: false,
};
interface InitiateSubscriptionPayload {
  userId: string;
}

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    checkSubscriptionRequest(state, action: PayloadAction<CheckSubscriptionPayload>) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Prepare for a new subscription check
      state.isLoading = true;
      state.error = null;
      state.hasCheckedSubscription = false;
    },
    checkSubscriptionSuccess(state, action: PayloadAction<boolean>) {
      // Handle a successful subscription status fetch
      state.isLoading = false;
      state.subscriptionStatus = action.payload;
      state.hasCheckedSubscription = true;
    },
    checkSubscriptionFailure(state, action: PayloadAction<string>) {
      // Handle a failure during subscription check
      state.isLoading = false;
      state.error = action.payload;
      state.hasCheckedSubscription = true;
    },
    updateSubscriptionStatus(state, action: PayloadAction<boolean>) {
      // Update the subscription status directly
      state.subscriptionStatus = action.payload;
    },
    initiateSubscriptionRequest(state, action: PayloadAction<InitiateSubscriptionPayload>) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Start the subscription initiation process
      state.isLoading = true;
    },
    initiateSubscriptionFailure(state, action: PayloadAction<string>) {
      // Handle a failure during subscription initiation
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  checkSubscriptionRequest,
  checkSubscriptionSuccess,
  checkSubscriptionFailure,
  updateSubscriptionStatus,
  initiateSubscriptionRequest,
  initiateSubscriptionFailure,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
