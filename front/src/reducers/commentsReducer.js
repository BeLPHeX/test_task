import { SET_COMMENTS, SET_CURRENT_COMMENT, OPERATION_MESSAGE } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  comments: [],
  current: {},
  message: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_COMMENTS:
      return {
        ...state,
        comments: action.payload
      };
    case SET_CURRENT_COMMENT:
      return {
        ...state,
        current: action.payload
      };
    case OPERATION_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
}
