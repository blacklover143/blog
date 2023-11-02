import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const initialState = [];

//Lesson2 - user state
// { id: "0", name: "frankyWO" },
// { id: "1", name: "karanWO" },
// { id: "2", name: "sophieWO" },

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // return data from fetched api
      // just returning action.payload means setting state directly/overriding
      return action.payload;
    });
  },
});

export const selectAllUsers = (state) => state.users;

// get user by id
export const SelectUserById = (state, userId) =>
  state.users.find((user) => user.id === userId);

//export current state
export default usersSlice.reducer;
