import { useSelector, useDispatch } from "react-redux";
// import functions from counter reducer to change state
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useState } from "react";

// reset both increment amount and counter state(via dispatch )

const Counter = () => {
  const [incrementVal, setIncrementVal] = useState(0);
  const dispatch = useDispatch();
  const addValue = Number(incrementVal) || 0;
  // use useSelector to choose which reducers state we want
  const count = useSelector(
    (state) =>
      //state will be the store reducer object
      state.counter.count
  );

  const resetAll = () => {
    setIncrementVal(0);
    dispatch(reset());
  };

  //   dispatch is used to call functions that change state in the particular reducer
  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
      <input
        type="text"
        value={incrementVal}
        onChange={(e) => setIncrementVal(e.target.value)}
      />
      <div>
        <button onClick={() => dispatch(incrementByAmount(addValue))}>
          Add Value
        </button>
        <button onClick={resetAll}> Reset </button>
      </div>
    </section>
  );
};

export default Counter;
