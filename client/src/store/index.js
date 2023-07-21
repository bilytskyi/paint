import { configureStore } from "@reduxjs/toolkit";
import buttonReducer from "./buttonSlice";
import toolReducer from "./toolSlice";
import canvasReducer from "./canvasSlice";

export default configureStore({
    reducer: {
        btnReducer: buttonReducer,
        tool: toolReducer,
        canvas: canvasReducer,
    }
});