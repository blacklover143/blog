import { useSelector } from "react-redux";
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  selectPostIds,
} from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsLists = () => {
  // select a reducer to get posts
  // const posts = useSelector(selectAllPosts);
  // after using entity adapter
  const orderedPosts = useSelector(selectPostIds);
  // gets all postS Ids but in sorted ordered as defined in adapter

  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);
  //reverse posts ordering(latest first)

  // useEffect(() => {
  //   if (postsStatus === "idle") {
  //     dispatch(fetchPosts());
  //   }
  // }, [dispatch, postsStatus]);

  let content = "";
  if (postsStatus === "loading") {
    content = <p>Loading ....</p>;
  } else if (postsStatus === "succeeded") {
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date));
    // content = orderedPosts.map((post) => (
    //   <PostsExcerpt key={post.id} post={post} />
    // ));
    content = orderedPosts.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }
  return <section>{content}</section>;
};

export default PostsLists;
