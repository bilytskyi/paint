import { createSlice } from "@reduxjs/toolkit";

const toolSlice = createSlice({
    name: 'tool',
    initialState: {
        toolsSetting: {
            currentTool: 'line',
            line: {color: '#10a8ea', stroke: '#10a8ea', width: 2},
            brush: {color: '#10a8ea', stroke: '#000000', width: 30},
            circle: {color: '#ffffff', stroke: '#000000', width: 1},
            eraser: {color: '#ffffff', stroke: '#ffffff', width: 1},
            rect: {color: '#ffffff', stroke: '#000000', width: 1},
            mybrush: {color: '#10a8ea', stroke: '#10a8ea', width: 12},
            myrect: {color: 'blue', stroke: 'red', width: 5},
            mycircle: {color: 'pink', stroke: 'orange', width: 10},
            myline: {color: 'black', stroke: 'black', width: 1},
            myeraser: {color: "#FFFFFF", stroke: "#FFFFFF", width: 10}
        },
        tool: null,
        isDrawing: false
    },
    reducers: {
        setIsDrawing(state, action) {
            state.isDrawing = action.payload
            console.log(state.isDrawing)
        },
        setTool(state, action) {
            console.log(action.payload.tool)
            state.tool = action.payload.tool;
        },
        setCurrentTool(state, action) {
            state.toolsSetting.currentTool = action.payload;
            console.log(state.toolsSetting.currentTool)
        },
        setFillColor(state, action) {
            console.log('collor')
            console.log(state.toolsSetting)
            console.log(action)
            switch (state.toolsSetting.currentTool) {
                case 'line':
                    state.toolsSetting.line.color = action.payload.fillColor
                    break;
                case 'circle':
                    state.toolsSetting.circle.color = action.payload.fillColor
                    break;
                case 'rect':
                    state.toolsSetting.rect.color = action.payload.fillColor
                    break;
                case 'brush':
                    state.toolsSetting.brush.color = action.payload.fillColor
                    break;
            }
            // state.tool.fillColor = action.payload.fillColor;
            // console.log(action.payload.fillColor)
        },
        setStrokeColor(state, action) {
            switch (state.toolsSetting.currentTool) {
                case 'line':
                    state.toolsSetting.line.stroke = action.payload.strokeColor
                    break;
                case 'circle':
                    state.toolsSetting.circle.stroke = action.payload.strokeColor
                    break;
                case 'rect':
                    state.toolsSetting.rect.stroke = action.payload.strokeColor
                    break;
                case 'brush':
                    state.toolsSetting.brush.stroke = action.payload.strokeColor
                    break;
            }
        },
        setLineWidth(state, action) {
            switch (state.toolsSetting.currentTool) {
                case 'line':
                    state.toolsSetting.line.width = action.payload.lineWidth
                    break;
                case 'circle':
                    state.toolsSetting.circle.width = action.payload.lineWidth
                    break;
                case 'rect':
                    state.toolsSetting.rect.width = action.payload.lineWidth
                    break;
                case 'brush':
                    state.toolsSetting.brush.width = action.payload.lineWidth
                    break;
                case 'eraser':
                    state.toolsSetting.eraser.width = action.payload.lineWidth
                    break;
            }
            // state.tool.lineWidth = action.payload.lineWidth;
        },
    }
})

export const {setTool, setIsDrawing, setLineWidth, setFillColor, setStrokeColor, setCurrentTool} = toolSlice.actions;

export default toolSlice.reducer;