import axios from "axios";
import { GET_SETTINGS } from "./types";

export const getSettings = uid => async dispatch => {
  const request = await axios.get(`/api/users/defaults?uid=${uid}`);
  dispatch({ type: GET_SETTINGS, payload: request.data });
};
export function chgDefaultCity( uid, chgCity) {
  return dispatch => {
    return axios.post(`/api/users/chgDefaultCity?uid=${uid}`, chgCity);
  };
}
