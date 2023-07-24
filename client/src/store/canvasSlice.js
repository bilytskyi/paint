import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        canvas: null,
        undoList: [],
        redoList: [],
        username: '',
        sessionID: null,
        cnv: null,
        testAction: [],
        data: ''
    },
    reducers: {
        setData(state, action) {
            state.data = state.data + action.payload
        },
        setSocket(state, action) {
            return action.payload
        },
        setCnv(state, action) {
            state.cnv = action.payload;
        },
        setUserName(state, action) {
            state.username = action.payload;
        },
        setSessionID(state, action) {
            state.sessionID = action.payload;
        },
        setCanvas(state, action) {
            state.canvas = action.payload.canvas;
        },
        pushToUndo(state, action) {
            state.undoList.push(action.payload);
        },
        pushToRedo(state, action) {
            state.redoList.push(action.payload);
        },
        setTestAction(state, action) {
            state.testAction.push(action.payload)
        },
        undo(state, action) {
            let ctx = action.payload.getContext('2d');
            if (state.undoList.length > 0) {
                let dataUrl = state.undoList.pop()
                state.redoList.push(ctx.canvas.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
                }
            } else {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            }
        },
        redo(state, action) {
            let ctx = action.payload.getContext('2d');
            if (state.redoList.length > 0) {
                let dataUrl = state.redoList.pop()
                state.undoList.push(ctx.canvas.toDataURL())
                let img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
                }
            }
        }
    }
})

export const {setCanvas, setCnv, setData, pushToUndo, pushToRedo, undo, redo, setUserName, setSocket, setSessionID, setTestAction} = canvasSlice.actions;

export default canvasSlice.reducer;