import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
// import React from "react";

const PostsExcerpt = ({ postId }) => {
  // although we are using adapter's get by id method which is not defined locally it always requires an id to work
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

// for better performance - Doesn't rerender this component until and unless the props are changed for this component
// PostsExcerpt = React.memo(PostsExcerpt);

export default PostsExcerpt;
