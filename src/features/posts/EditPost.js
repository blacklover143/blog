import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { selectAllUsers } from "../users/usersSlice";
import { selectPostById, updatePost, deletePost } from "./postsSlice";

const EditPost = () => {
  // grab postId (/post/edit/:postId) from url
  const { postId } = useParams();

  const navigate = useNavigate();

  //   get post by id
  const post = useSelector((state) => selectPostById(state, Number(postId)));

  // get users
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [userId, setUserId] = useState(post?.userId);
  const [content, setContent] = useState(post?.body);
  const [reqStatus, setReqStatus] = useState("idle");

  const dispatch = useDispatch();

  if (!post) {
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    );
  }
  const canUpdate =
    Boolean(title) &&
    Boolean(userId) &&
    Boolean(content) &&
    reqStatus === "idle";

  const usersOptions = users.map((user) => (
    <option id={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const savePost = () => {
    if (canUpdate) {
      try {
        setReqStatus("pending");
        dispatch(
          updatePost({
            id: post.id,
            title: title,
            body: content,
            userId: userId,
            reactions: post.reactions,
          })
        ).unwrap();
        setTitle("");
        setUserId("");
        setContent("");
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error("Failed to update the post", err);
      } finally {
        setReqStatus("idle");
      }
    }
  };

  const ondeletePost = () => {
    try {
      setReqStatus("pending");
      dispatch(deletePost({ id: postId })).unwrap();
      setTitle("");
      setUserId("");
      setContent("");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the post", err);
    } finally {
      setReqStatus("idle");
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postAuthor">Author</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={savePost} disabled={!canUpdate}>
          Save Post
        </button>
        <button className="deleteButton" type="button" onClick={ondeletePost}>
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPost;
