import axios from "axios";
import { GET_USER } from "./types";

export const getUser = uid => async dispatch => {
  const request = await axios.get(`/api/users/id?uid=${uid}`);
  dispatch({ type: GET_USER, payload: request.data });
};

