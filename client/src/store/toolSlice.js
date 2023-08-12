import { createSlice } from "@reduxjs/toolkit";

const toolSlice = createSlice({
    name: 'tool',
    initialState: {
        toolsSetting: {
            currentTool: 'mybrush',
            line: {color: '#10a8ea', stroke: '#10a8ea', width: 2},
            brush: {color: '#10a8ea', stroke: '#000000', width: 30},
            circle: {color: '#ffffff', stroke: '#000000', width: 1},
            eraser: {color: '#ffffff', stroke: '#ffffff', width: 1},
            rect: {color: '#ffffff', stroke: '#000000', width: 1},
            mybrush: {color: '#10a8ea', stroke: '#10a8ea', width: 15},
            myrect: {color: "#FFFFFF", stroke: '#000000', width: 2},
            mycircle: {color: "#FFFFFF", stroke: '#000000', width: 2},
            myline: {color: '#A52A2A', stroke: '#FF0000', width: 2},
            myeraser: {color: "#FFFFFF", stroke: "#FFFFFF", width: 20},
            mymouse: {color: "#FFFFFF", stroke: "#FFFFFF", width: 10}
        },
        tool: null
    },
    reducers: {
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
                case 'myline':
                    state.toolsSetting.myline.color = action.payload.fillColor
                    break;
                case 'mycircle':
                    state.toolsSetting.mycircle.color = action.payload.fillColor
                    break;
                case 'myrect':
                    state.toolsSetting.myrect.color = action.payload.fillColor
                    break;
                case 'mybrush':
                    state.toolsSetting.mybrush.color = action.payload.fillColor
                    break;
            }
            // state.tool.fillColor = action.payload.fillColor;
            // console.log(action.payload.fillColor)
        },
        setStrokeColor(state, action) {
            switch (state.toolsSetting.currentTool) {
                case 'myline':
                    state.toolsSetting.myline.stroke = action.payload.strokeColor
                    break;
                case 'mycircle':
                    state.toolsSetting.mycircle.stroke = action.payload.strokeColor
                    break;
                case 'myrect':
                    state.toolsSetting.myrect.stroke = action.payload.strokeColor
                    break;
                case 'mybrush':
                    state.toolsSetting.mybrush.stroke = action.payload.strokeColor
                    break;
            }
        },
        setLineWidth(state, action) {
            switch (state.toolsSetting.currentTool) {
                case 'myline':
                    state.toolsSetting.myline.width = action.payload.lineWidth
                    break;
                case 'mycircle':
                    state.toolsSetting.mycircle.width = action.payload.lineWidth
                    break;
                case 'myrect':
                    state.toolsSetting.myrect.width = action.payload.lineWidth
                    break;
                case 'mybrush':
                    state.toolsSetting.mybrush.width = action.payload.lineWidth
                    break;
                case 'myeraser':
                    state.toolsSetting.myeraser.width = action.payload.lineWidth
                    break;
            }
            // state.tool.lineWidth = action.payload.lineWidth;
        },
    }
})

export const {setTool, setLineWidth, setFillColor, setStrokeColor, setCurrentTool} = toolSlice.actions;

export default toolSlice.reducer;