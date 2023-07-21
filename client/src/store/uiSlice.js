import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        lineInput: 1
    },
    reducers: {
        setLineInput(state, action) {
            state.lineInput = action.payload;
        },
    }
})

export const {setLineInput,} = uiSlice.actions;

export default uiSlice.reducer;