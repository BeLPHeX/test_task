import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import commentsReducer from "./commentsReducer";

export default combineReducers({
  errors: errorReducer,
  comments: commentsReducer
});
