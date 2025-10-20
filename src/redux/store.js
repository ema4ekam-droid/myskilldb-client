import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import organizationReducer from "./organizationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
  },
});
