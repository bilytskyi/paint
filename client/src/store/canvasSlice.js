import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        canvas: null,
        undoList: [],
        redoList: [],
        username: '',
        userId: '',
        users: null,
        sessionID: null,
        cnv: null,
        testAction: [],
        data: '',
        selected: null
    },
    reducers: {
        setData(state, action) {
            state.data = state.data + action.payload
        },
        setSelected(state, action) {
            console.log(action.payload)
            state.selected = action.payload
        },
        setSocket(state, action) {
            return action.payload
        },
        setUsers(state, action) {
            const equalsCheck = (a, b) => {
                return JSON.stringify(a) === JSON.stringify(b);
            }
            if (state.users === null) {
                state.users = action.payload
            } else {
                if (!equalsCheck(state.users, action.payload)) {
                    state.users = action.payload
                }
            }
        },
        setCnv(state, action) {
            state.cnv = action.payload;
        },
        setUserName(state, action) {
            state.username = action.payload;
        },
        setUserId(state, action) {
            state.userId = action.payload;
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

export const {setCanvas, setSelected, setUsers, setUserId, setCnv, setData, pushToUndo, pushToRedo, undo, redo, setUserName, setSocket, setSessionID, setTestAction} = canvasSlice.actions;

export default canvasSlice.reducer;