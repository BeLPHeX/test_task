import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        source: action.payload.source,
        message: backendErrorProcessing(action.payload.error)
      }
    default:
      return state;
  }
}

function backendErrorProcessing(error) {
  switch (error.message) {
    case 'Wrong password.':
      return 'Wrong password.';
    case 'Wrong email.':
      return 'No user with this email.';
    default:
      return error.message;
  }
}