import { all } from "redux-saga/effects";
import uploadSaga from "../features/upload/saga";
import subscriptionSaga from "../features/subscription/sagas";

export default function* rootSaga(): Generator {
  yield all([
    uploadSaga(),
    subscriptionSaga(), // Add both sagas here
  ]);
}
