import React, {useEffect, useRef, useState} from 'react'
import "../styles/toolbar.scss"
import { useDispatch, useSelector } from 'react-redux';
import {undo, redo} from '../store/canvasSlice';
import {setLineWidth, setFillColor, setStrokeColor, setCurrentTool} from '../store/toolSlice';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import MyBrush from '../tools/MyBrush';
import BrushButton from './UI/BrushButton';
import FiguresButton from './UI/FiguresButton';
import EraserButton from './UI/EraserButton';
import ClearButton from './UI/ClearButton';
import MyRect from '../tools/MyRect';
import MyCircle from '../tools/MyCircle'
import MyLine from '../tools/MyLine';
import MyEraser from '../tools/MyEraser'
import MyMouse from '../tools/MyMouse';
import drawFromMemory from '../utilities/DrawFromMemory';
import { useWebSocket } from '../utilities/WebSocketContext';
import MouseComponent from './UI/MouseComponent';
import BrushComponent from './UI/BrushComponent';
import RectComponent from './UI/RectComponent';
import CircleComponent from './UI/CircleComponent';
import LineComponent from './UI/LineComponent';
import EraserComponent from './UI/EraserComponent';
import UndoComponent from './UI/UndoComponent';
import RedoComponent from './UI/RedoComponent';
import ClearComponent from './UI/ClearComponent';
import SaveComponent from './UI/SaveComponent';
// import { useCanvases } from "../utilities/CanvasesContext";

const Toolbar = () => {
  const { websocket, isConnected } = useWebSocket()
  // const { canvases, isChange } = useCanvases()
  const dispatch = useDispatch();
  // const canvas = useSelector(state => state.canvas.canvas);
  const canvas = document.getElementById("canvas");
  const data = useSelector(state => state.canvas.data)
  const toolsSetting = useSelector(state => state.tool.toolsSetting)
  const undoList = useSelector(state => state.canvas.undoList)
  const lineSetting = useSelector(state => state.tool.line)
  const circleSetting = useSelector(state => state.tool.circle)
  const currentTool = useSelector(state => state.tool.toolsSetting.currentTool)
  const color = useSelector(state => state.tool.toolsSetting[currentTool].color)
  const width = useSelector(state => state.tool.toolsSetting[currentTool].width)
  const stroke = useSelector(state => state.tool.toolsSetting[currentTool].stroke)
  const testAction = useSelector(state => state.canvas.testAction)
  const activeUsers = useSelector(state => state.canvas.users)
  const userId = useSelector(state => state.canvas.userId)
  const deserialize = (data, canvas) => {
    let img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
    }
    img.src = data;
  }
  const serialize = (canvas) => {
    return canvas.toDataURL();
  }

  useEffect(() => {
    switch (toolsSetting.currentTool) {
      case 'mybrush':
        new MyBrush(toolsSetting.mybrush, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("brush")
        break;
      case 'myrect':
        new MyRect(toolsSetting.myrect, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("rect")
        break;
      case 'mycircle':
        new MyCircle(toolsSetting.mycircle, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("circle")
        break;
      case 'myline':
        new MyLine(toolsSetting.myline, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("line")
        break;
      case 'myeraser':
        new MyEraser(toolsSetting.myeraser, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("eraser")
        break;
      case 'mymouse':
        new MyMouse(toolsSetting.mymouse, sessionID, userName, websocket, userId)
        canvas.className = "canvas"
        canvas.classList.add("mouse")
        break;
    }
  }, [toolsSetting])

  // useEffect(() => {
  //   deserialize(data, canvas)
  // }, []) 
  // const socket = useSelector(state => state.canvas.socket);
  // const socket = new WebSocket('ws://localhost:5000/')

  const userName = useSelector(state => state.canvas.username);
  const sessionID = useSelector(state => state.canvas.sessionID);
  const cnv = useSelector(state => state.canvas.cnv);

  const fff = () => {
    console.log('fff')
    console.log(Object.keys(undoList).length)
    const task = (i) => {
      setTimeout(function() {
        console.log('ff7777f')
        deserialize(undoList[i.toString()], canvas)
    }, 300 * i);
    }
    for (let i = 0; i < Object.keys(undoList).length; i++){
      console.log('ff444444f')
      task(i);
    }
  }

  const changeColor = e => {
    dispatch(setFillColor({fillColor: e.target.value}))
    dispatch(setStrokeColor({strokeColor: e.target.value}))
  }

  const save = () => {
    const dataUrl = canvas.toDataURL()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = sessionID + '.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvas.getContext('2d')
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y)
        break
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
        break
      case 'finish':
        ctx.beginPath()
        break
    }
  }

  const memory = () => {
    testAction.forEach((act, i) => {
      setTimeout(() => {
        console.log('d');
        drawHandler(act);
      }, i * 10);
    });
    // testAction.forEach(element => {
    //   console.log('d')
    //   drawHandler(element)
    // });
  }

  const clear = () => {
    websocket.send(JSON.stringify({
      method: "draw",
      id: sessionID,
      tool: {
        name: "clear"
      }
    }))
  }

  const undo = () => {
    websocket.send(JSON.stringify({
      method: "draw",
      id: sessionID,
      tool: {
        name: "undo",
        userid: userId
      }
    }))
  }

  const redo = () => {
    websocket.send(JSON.stringify({
      method: "draw",
      id: sessionID,
      tool: {
        name: "redo",
        userid: userId
      }
    }))
  }

const toolbarRef = useRef()

  return (
    <div className='toolbar' ref={toolbarRef}>
      <label htmlFor='line-width'>Width:</label>
      <input 
            onChange={e => dispatch(setLineWidth({lineWidth: e.target.value}))}
            id='line-width'
            type='number'
            value={width}
            min={1}
            max={50} />
      <label htmlFor='stroke-color'>Color:</label>
      <input onChange={e => dispatch(setStrokeColor({strokeColor: e.target.value}))} id='stroke-color' value={stroke} type="color" />
      {currentTool === "myrect" || currentTool === "mycircle" ? 
      <>
      <label htmlFor='color'>Fill:</label>
      <input onChange={e => dispatch(setFillColor({fillColor: e.target.value}))} type='color' value={color} id='color'/> </> : <></>}
      

        <MouseComponent currTool={currentTool} size={"24"} title={"mouse"} />
        <BrushComponent currTool={currentTool} size={"24"} title={"brush"} />
        <RectComponent currTool={currentTool} size={"24"} title={"brush"} />
        <CircleComponent currTool={currentTool} size={"24"} title={"brush"} />
        <LineComponent currTool={currentTool} size={"24"} title={"brush"} />
        <EraserComponent currTool={currentTool} size={"24"} title={"brush"} />
        <UndoComponent undo={undo} size={"24"} title={"brush"} />
        <RedoComponent redo={redo} size={"24"} title={"brush"} />
        <ClearComponent clear={clear} size={"24"} title={"brush"} />
        <SaveComponent save={save} size={"24"} title={"brush"} />

    </div>
  )
}

export default Toolbar