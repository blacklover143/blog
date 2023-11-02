// import Counter from "./features/counter/Counter";
import PostsLists from "./features/posts/PostsLists";
import UsersLists from "./features/users/UsersLists";
import AddForm from "./features/posts/AddForm";
import SinglePost from "./features/posts/SinglePost";
import UserPage from "./features/users/UserPage";
import EditPost from "./features/posts/EditPost";
import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Home route '/' */}
      <Route path="/" element={<Layout />}>
        {/* index page on home route '/' */}
        <Route index element={<PostsLists />} />
        {/* "/post" route */}
        <Route path="post">
          {/* index pasge on /post */}
          <Route index element={<AddForm />} />
          {/* route /post/:id */}
          <Route path=":postId" element={<SinglePost />} />
          {/* route /post/edit/:postId */}
          <Route path="edit/:postId" element={<EditPost />} />
        </Route>
        <Route path="user">
          {/* "/user" */}
          <Route index element={<UsersLists />} />
          {/* /user/:userId */}
          <Route path=":userId" element={<UserPage />} />
        </Route>
        {/* Catch all - When someone goes to any other route as /any redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
