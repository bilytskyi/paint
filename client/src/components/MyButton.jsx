import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {increment, decrement} from '../store/buttonSlice';

const MyButton = () => {
  const dispatch = useDispatch();
  const count = useSelector(state => state.btnReducer.count);
  return (
    <>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())} >increment</button>
      <button onClick={() => dispatch(decrement())} >decrement</button>
    </>
  )
}

export default MyButton