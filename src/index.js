import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// store is a global state container
import { store } from "./app/store";
import { Provider } from "react-redux";

//
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//get users and posts immediately as app loads to fill the state
import { fetchUsers } from "./features/users/usersSlice";
import { fetchPosts } from "./features/posts/postsSlice";
// store can dispatch any function related to state of reducers(whose slice is defined in store)
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* make available store to all components via provider */}
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </>
);
