import { all } from "redux-saga/effects";
import uploadSaga from "../features/upload/saga";

export default function* rootSaga(): Generator {
  yield all([uploadSaga()]);
}
