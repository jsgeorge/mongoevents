import { SET_CURRENT_USER, AUTH_ERROR } from "../actions/types";
import isEmpty from "lodash/isEmpty";

const initialState = {
  isAuthenticated: false,
  user: {},
  error: "",
};
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user,
      };
    case AUTH_ERROR:
      return {
        error: action.payload,
      };
    default:
      return state;
  }
};
