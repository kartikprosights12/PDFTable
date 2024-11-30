import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  isLoading: boolean;
  subscriptionStatus: boolean;
  error: string | null;
  hasCheckedSubscription: boolean; // To track whether subscription check is complete
}

const initialState: SubscriptionState = {
  isLoading: false,
  subscriptionStatus: false,
  error: null,
  hasCheckedSubscription: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    checkSubscriptionRequest(state) {
      state.isLoading = true;
      state.error = null;
      state.hasCheckedSubscription = false;
    },
    checkSubscriptionSuccess(state, action: PayloadAction<boolean>) {
      state.isLoading = false;
      state.subscriptionStatus = action.payload;
      state.hasCheckedSubscription = true;
    },
    checkSubscriptionFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.hasCheckedSubscription = true;
    },
    updateSubscriptionStatus(state, action: PayloadAction<boolean>) {
      state.subscriptionStatus = action.payload;
    },
  },
});

export const {
  checkSubscriptionRequest,
  checkSubscriptionSuccess,
  checkSubscriptionFailure,
  updateSubscriptionStatus,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
