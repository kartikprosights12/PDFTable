import { takeLatest, call, put, CallEffect, PutEffect } from "redux-saga/effects";
import axios from "axios";
import {
  checkSubscriptionRequest,
  checkSubscriptionSuccess,
  checkSubscriptionFailure,
  initiateSubscriptionRequest,
  initiateSubscriptionFailure,
} from "./reducer";
import { urls } from "@/config/urls";
import { PayloadAction } from "@reduxjs/toolkit";

const apiBaseUrl = urls.apiBaseUrl;

// Define the shape of your API response
interface SubscriptionData {
  subscription_status: string | boolean; // Can be a string or boolean depending on API
  subscription_required: boolean;
  data: any;
  status:string;
}

// Define payload structures
interface CheckSubscriptionPayload {
  userId: string;
}

interface InitiateSubscriptionPayload {
  userId: string;
}

// API calls
const fetchSubscriptionStatus = async (userId: string): Promise<SubscriptionData> => {
  console.log("Fetching subscription status for userId:", userId); // Log the userId
  return axios
    .get(apiBaseUrl + `/api/v1/users/subscriptions/status?user_id=${userId}`)
    .then((res) => res.data);
};

const initiateSubscription = async (userId: string): Promise<any> => {
  console.log("Initiating subscription for userId:", userId);
  return axios
    .post(apiBaseUrl + `/api/v1/users/subscriptions/initiate`, { user_id: userId })
    .then((res) => res.data);
};

// Worker Saga: Handle subscription check
function* handleCheckSubscription(
  action: PayloadAction<CheckSubscriptionPayload>
): Generator<CallEffect | PutEffect, void, SubscriptionData> {
  const { userId } = action.payload;

  try {
    const subscriptionData = yield call(fetchSubscriptionStatus, userId);

    // Convert subscription_status to a boolean if needed
    let isActive =
      typeof subscriptionData.status === "string"
        ? subscriptionData.status === "active"
        : subscriptionData.status;
      
        if(!subscriptionData.subscription_required) {
        isActive = true;
        yield put(checkSubscriptionSuccess(isActive));
      }
    // Dispatch success action with boolean
    yield put(checkSubscriptionSuccess(isActive));

    // Handle subscription initiation logic if required
    if (subscriptionData.subscription_required) {
      if (!isActive || subscriptionData.subscription_status === "expired") {
        yield put(initiateSubscriptionRequest({ userId }));
      }
    }
  } catch (error: any) {
    yield put(checkSubscriptionFailure(error.message || "Subscription check failed."));
  }
}

// Worker Saga: Handle subscription initiation
function* handleInitiateSubscription(
  action: PayloadAction<InitiateSubscriptionPayload>
): Generator<CallEffect | PutEffect, void, any> {
  const { userId } = action.payload;

  try {
    const formResponse = yield call(initiateSubscription, userId);
    window.location.href = formResponse.checkout_url; // Redirect to Stripe
  } catch (error: any) {
    yield put(initiateSubscriptionFailure(error.message || "Failed to initiate subscription."));
  }
}

// Watcher Saga: Combine all watchers
function* subscriptionSaga() {
  yield takeLatest(checkSubscriptionRequest.type, handleCheckSubscription);
  yield takeLatest(initiateSubscriptionRequest.type, handleInitiateSubscription);
}

export default subscriptionSaga;