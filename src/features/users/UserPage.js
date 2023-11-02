import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectAllPosts, selectPostByUser } from "../posts/postsSlice";
import { SelectUserById } from "./usersSlice";

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => SelectUserById(state, Number(userId)));

  //  causes bad performance cause this function is triggered again when header state changes(count value)
  //   userpage rerenders when count state is changed
  //   const postsForUser = useSelector((state) => {
  //     const allPosts = selectAllPosts(state);
  //     return allPosts.filter((post) => post.userId === Number(userId));
  //   });

  // for good performance
  //   user page doesnt render again when count state is changed
  const postsForUser = useSelector((state) =>
    selectPostByUser(state, Number(userId))
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));
  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
