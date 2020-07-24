import { combineReducers } from "redux";

import auth from "./auth-reducer";
import curuser from "./user-reducer";
import events from "./event-reducer";
import categories from "./category-reducer";
import settings from "./setting-reducer";
export default combineReducers({
  auth,
  curuser,
  events,
  categories,
  settings
});
