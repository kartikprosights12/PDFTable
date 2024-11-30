import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  checkSubscriptionRequest,
  checkSubscriptionSuccess,
  checkSubscriptionFailure
} from "./reducer";
import { urls } from "@/config/urls";

const apiBaseUrl = urls.apiBaseUrl;

// API calls
const fetchSubscriptionStatus = async (userId: string) =>
    axios.get(apiBaseUrl + `/api/v1/users/subscriptions/status?user_id=${userId}`).then((res) => res.data);

function* handleCheckSubscription(action: { payload: { userId: string; sessionId?: string } }) {
  const { userId } = action.payload;

  try {

    const subscriptionData = yield call(fetchSubscriptionStatus, userId);
    yield put(checkSubscriptionSuccess(subscriptionData.subscription_status));
    console.log('subscriptionData', subscriptionData);
    if (subscriptionData.subscription_required) {
      if (
        !subscriptionData.subscription_status || // No subscription status
        subscriptionData.subscription_status === "expired" // Status is expired
      ) {
        const formResponse = yield call(
          axios.post,
          apiBaseUrl + `/api/v1/users/subscriptions/initiate`,
          { user_id: userId }
        );
        window.location.href = formResponse.data.checkout_url; // Redirect to Stripe
      }
    }
    
  } catch (error: any) {
    yield put(checkSubscriptionFailure(error.message || "Subscription check failed."));
  }
}

function* subscriptionSaga() {
  yield takeLatest(checkSubscriptionRequest.type, handleCheckSubscription);
}

export default subscriptionSaga;
