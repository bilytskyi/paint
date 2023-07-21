import { createSlice } from "@reduxjs/toolkit";

const buttonSlice = createSlice({
    name: 'btnReducer',
    initialState: {
        count: 0
    },
    reducers: {
        increment(state, action) {
            state.count++;
            console.log(state);
            console.log(action);
        },
        decrement(state, action) {
            state.count--;
            console.log(state.count);
        },
    }
});

export const {increment, decrement} = buttonSlice.actions;

export default buttonSlice.reducer;