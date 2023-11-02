import { configureStore } from "@reduxjs/toolkit";
// get all reducers here
// import counterReducer from "../features/counter/counterSlice";
import postReducer from "../features/posts/postsSlice";
import userReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    // all the reducers(state) inside reducer will be available to all the components
    // counter: counterReducer,
    posts: postReducer,
    users: userReducer,
  },
});
