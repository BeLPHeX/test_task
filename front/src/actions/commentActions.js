import axios from "axios";

import { GET_ERRORS, SET_COMMENTS, SET_CURRENT_COMMENT, OPERATION_MESSAGE } from "./types";
axios.defaults.withCredentials = true;
const port = 5000;
const location = {
  protocol: "http:",
  hostname: "ec2-3-135-205-96.us-east-2.compute.amazonaws.com"
}
axios.defaults.baseURL = location.protocol + '//' + location.hostname + ':' + port;

export const getComments = () => dispatch => {
  axios.get("/comments")
    .then(res => {
      dispatch({
        type: SET_COMMENTS,
        payload: res.data.comments
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          source: 'get comments',
          error: err
        }
      })
    });
};

export const readComment = (id) => dispatch => {
  axios.get("/read", { params: { id: id } })
    .then(res => {
      dispatch({
        type: SET_CURRENT_COMMENT,
        payload: res.data.comment
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          source: 'read comment',
          error: err.response.data.error
        }
      })
    });
};
export const deleteComment = (id) => dispatch => {
  axios.get("/delete", { params: { id: id } })
    .then(res => {
      dispatch(setOperationMessage(res.data.message))
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          source: 'delete comment',
          error: err.response.data.error
        }
      })
    });
};

export const createComment = (comment) => dispatch => {
  axios.post("/create", comment)
    .then(res => {
      dispatch(setOperationMessage(res.data.message))
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          source: 'create comment',
          error: err.response.data.error
        }
      })
    });
};

export const updateComment = (comment) => dispatch => {
  axios.post("/update", comment)
    .then(res => {
      dispatch(setOperationMessage(res.data.message))
      dispatch({
        type: SET_CURRENT_COMMENT,
        payload: {}
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: {
          source: 'update comment',
          error: err.response.data.error
        }
      })
    });
};

export const setOperationMessage = (message) => {
  return {
    type: OPERATION_MESSAGE,
    payload: message
  };
}

export const deleteOperationMessage = () => dispatch => {
  dispatch({
    type: OPERATION_MESSAGE,
    payload: {}
  });
}