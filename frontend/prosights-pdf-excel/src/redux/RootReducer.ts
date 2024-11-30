import { combineReducers } from "redux";
import uploadReducer from "../features/upload/reducer";
import userReducer from "./UserSlice";
import subscriptionReducer from "../features/subscription/reducer"

const rootReducer = combineReducers({
  upload: uploadReducer,
  user: userReducer, 
  subscription: subscriptionReducer,
});

export default rootReducer;
