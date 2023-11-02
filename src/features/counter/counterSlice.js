// this is a slice of app's state or a feature of app(counter named here) whose state is managed individually but is available globally
import { createSlice } from "@reduxjs/toolkit";

// this is the app state
const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  //reducer def
  name: "counter",
  initialState,
  reducers: {
    //actions
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
    incrementByAmount: (state, action) => {
      //the value passed will be action.payload
      state.count += action.payload;
    },
  },
});

// export actions (inc and dec here) and full reducer of counterSlice
export const { increment, decrement, reset, incrementByAmount } =
  counterSlice.actions;

export default counterSlice.reducer;
