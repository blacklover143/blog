import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

// define entity adapter
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
  // now the posts state is state.entities
  // posts: [],
  status: "idle", //idle | loading | succedded | failed
  error: null,
  count: 0,
});

//async thunk for getting posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);

  return response.data;
});
//async thunk for posting a post
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);

//async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    // get id from the object that is being sent to be update post
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      // gets triggered when we try to update a post thats not in API aka that we created manually
      // console.log(err.message);
      //after having error we can send the data back (aka initialPost) as if update was successful to the api to successfully update the local state
      // IMP - ONLY FOR LOCAL TESTING
      return initialPost;
    }
  }
);

// async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) {
        // manually return id back cause jsonplaceholder doesn't
        return initialPost;
      }
      return `${response?.status} : ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

//lesson2-state -
//   {
//     id: "1",
//     title: "Learning redux toolkit",
//     content:
//       "Redux is an open-source JavaScript library for managing and centralizing application state. It is most commonly used with libraries such as React or Angular for building user interfaces",
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
//   {
//     id: "2",
//     title: "React Redux",
//     content:
//       "React Redux is the official React binding for Redux. It allows React components to read data from a Redux Store, and dispatch Actions to the Store to update data. ",
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
// ];

// lesson-2 : Add data to state
// postAdded: {
//   reducer(state, action) {
//     state.posts.push(action.payload);
//   }, //prepare do validation before updating the state using reducer function and returns data as payload to reducer
//   prepare(title, content, userId) {
//     return {
//       payload: {
//         id: nanoid(),
//         title,
//         content,
//         date: new Date().toISOString(),
//         userId,
//         reactions: {
//           thumbsUp: 0,
//           wow: 0,
//           heart: 0,
//           rocket: 0,
//           coffee: 0,
//         },
//       },
//     };
//   },
// },

const postsSlice = createSlice({
  // all the data below can be accessed through postSlice.reducer
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      // const existingPost = state.posts.find((post) => post.id === postId);
      // after using entity adapter
      // we can assume that all the posts are entities and we can lookup up each of them with help of id
      const existingPost = state.entities[postId];

      if (existingPost) {
        existingPost.reactions[reaction] += 1;
      }
    },
    increaseCount(state, action) {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    //define what happens to state after thunk function gets executed |
    // add the response data(action.payload here) after various requests to the local state
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // when the data is fetched successfully
        let min = 1;
        //action.payload is the data we get from fetchPosts function | array of objects here
        const loadedPost = action.payload.map((post) => {
          // add more keys to the data
          post.date = sub(new Date(), { minutes: min + 1 }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        // update the state
        // state.posts = state.posts.concat(loadedPost);
        // after using entity adapter
        postsAdapter.upsertMany(state, loadedPost);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // after post is posted to api do following for updating state -
        // const sortedPosts = state.posts.sort((a, b) => {
        //   if (a.id > b.id) return 1;
        //   if (a.id < b.id) return -1;
        //   return 0;
        // });
        //action.payload is the data returned after addNewPost thunk gets executed |
        // add new keys to payload
        // action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // after using entity adapter

        action.payload.id = state.ids.length + 1;
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        // state.posts.push(action.payload);

        // after using entity adapter
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update couldn't be completed");
          // action.payload would be error here
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // update local state - remove the old post with that id and add updated post(action.payload)
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = [...posts, action.payload];
        // after using entity adapter
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        // if we don't get a id back
        if (!action.payload?.id) {
          console.log("Delete post failed");

          console.log(action.payload);
          return;
        }
        const { id } = action.payload;

        // const posts = state.posts.filter((post) => post.id !== Number(id));
        // console.log(posts.length);
        // update local state with posts without deleted posts
        // state.posts = posts;
        // after using entity adapter
        postsAdapter.removeOne(state, id);
      });
  },
});

// export a function that gets data from reducer
// this function can be implemented in postsListComponent to get posts but we are doing it here cause if any time any change happen on the data we can implement that on this file instead of each and every component.
// goes to store and gets posts state

// export const selectAllPosts = (state) => state.posts.posts;
// use entity adapter instead

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

//get a single post from state
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);
// use entity adapter instead

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
// in createSlice method we have deined name of state as posts so we can do above expression

//memoized eelector for better performance
// returns posts by userId
//this function will trigger again only when userId changes
export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);
// return current state
export default postsSlice.reducer;

//export actions
export const { reactionAdded, increaseCount } = postsSlice.actions;
