import axios from "axios";
import setAuthorizationToken from "../utils/setAuthorizationToken";
import { SET_CURRENT_USER, AUTH_ERROR } from "./types";
import jwtDecode from "jwt-decode";
//mport { useHistory } from "react-router";

export function login(data) {
  // let history = useHistory();
  return (dispatch) => {
    return axios
      .post("/api/auth", data)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("jwtToken", token);
        setAuthorizationToken(token);
        dispatch(setCurrentUser(jwtDecode(token)));
        // history.push("/events");
      })
      .catch((res) => {
        dispatch(
          authError("Login Unssuccessfull. invalid email and/or passowrd")
        );
      });
  };
}

export function Signup(data) {
  // let history = useHistory();

  return (dispatch) => {
    return axios
      .post("/api/users", data)
      .then((res) => res.data)
      .catch((res) => {
        dispatch(
          authError(
            "Signup nssuccessfull. Unknown error or User already exists"
          )
        );
      });
  };
}
export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
}
export function isUserExists(identifier) {
  return (dispatch) => {
    return axios.get(`/api/users/${identifier}`);
  };
}
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user,
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem("jwtToken");
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}
