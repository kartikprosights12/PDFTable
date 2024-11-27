import { combineReducers } from "redux";
import uploadReducer from "../features/upload/reducer";
import userReducer from "./UserSlice";
const rootReducer = combineReducers({
  upload: uploadReducer,
  user: userReducer, 
});

export default rootReducer;
