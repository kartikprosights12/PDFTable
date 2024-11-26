import { combineReducers } from "redux";
import uploadReducer from "../features/upload/reducer";

const rootReducer = combineReducers({
  upload: uploadReducer,
});

export default rootReducer;
