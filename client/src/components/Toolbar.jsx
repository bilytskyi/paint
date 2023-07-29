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

const Toolbar = () => {
  const { websocket, isConnected } = useWebSocket()
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
      case 'line':
          new Line(toolsSetting.line, sessionID)
          dispatch(setCurrentTool('line'))
          break;
      case 'circle':
          new Circle(toolsSetting.circle, sessionID)
          dispatch(setCurrentTool('circle'))
          break;
      case 'rect':
        console.log('rect case')
          new Rect(toolsSetting.rect, sessionID)
          dispatch(setCurrentTool('rect'))
          break;
      case 'brush':
          console.log('brush case')
          new Brush(toolsSetting.brush, sessionID)
          dispatch(setCurrentTool('brush'))
          break;
      case 'eraser':
          new Eraser(toolsSetting.eraser, sessionID)
          dispatch(setCurrentTool('eraser'))
          break;
      case 'mybrush':
          new MyBrush(toolsSetting.mybrush, sessionID, userName, websocket)
          break;
      case 'myrect':
          new MyRect(toolsSetting.myrect, sessionID, userName, websocket)
          break;
      case 'mycircle':
          new MyCircle(toolsSetting.mycircle, sessionID, userName, websocket)
          break;
      case 'myline':
        new MyLine(toolsSetting.myline, sessionID, userName, websocket)
        break;
      case 'myeraser':
        new MyEraser(toolsSetting.myeraser, sessionID, userName, websocket)
        break;
      case 'mymouse':
        new MyMouse()
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

  const download = () => {
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
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 1920, 1080)
    websocket.send(JSON.stringify({
      method: "draw",
      id: sessionID,
      tool: {
        name: "clear"
      }
    }))
    websocket.send(JSON.stringify({
      method: "users",
      id: sessionID,
      user: userName,
      state: "end"
    }))


  }

const consoleSize = (array) => {
    // Convert array to JSON string
const jsonString = JSON.stringify(array);

// Create Blob object from the string
const blob = new Blob([jsonString]);

// Get the size of the blob in bytes
const sizeInBytes = blob.size;

// Convert bytes to kilobytes
const sizeInKB = sizeInBytes / 1024;
const objectURL = URL.createObjectURL(blob);

console.log('Object URL:', objectURL);
console.log('Size in bytes:', sizeInBytes);
console.log('Size in kilobytes:', sizeInKB);

// Create a FileReader
const reader = new FileReader();

// Set the onload event handler
reader.onload = function(event) {
  const fullText = event.target.result;
  console.log('Full text:', fullText);
};

// Read the Blob as text
reader.readAsText(blob);
  }


const getSize = (canvas) => {
  let k = canvas.toDataURL()
  console.log(k)

}

const iconsSizes = [26, 26]
const [openBrush, setOpenBrush] = useState(false)
const [openFigures, setOpenFigures] = useState(false)
const [openEraser, setOpenEraser] = useState(false)
const toolbarRef = useRef()
const brushButtonRef = useRef()
const figuresButtonRef = useRef()
window.addEventListener("click", (e) => {
  if (e.target == canvas) {
    setOpenBrush(false)
    setOpenFigures(false)
    setOpenEraser(false)
  }
})

  return (
    <div className='toolbar' ref={toolbarRef}>
        {/* <button className='toolbar__btn brush' onClick={() => {dispatch(setCurrentTool('brush'))}} />
        <button className='toolbar__btn rect' onClick={() => {dispatch(setCurrentTool('rect'))}} />
        <button className='toolbar__btn circle' onClick={() => {dispatch(setCurrentTool('circle'))}} />
        <button className='toolbar__btn eraser' onClick={() => {dispatch(setCurrentTool('eraser'))}} />
        <button className='toolbar__btn line' onClick={() => {dispatch(setCurrentTool('line'))}} />
        <input onChange={e => changeColor(e)} type='color' value={color} />
        <button className='toolbar__btn undo' onClick={() => dispatch(undo(canvas))} />
        <button className='toolbar__btn redo' onClick={() => dispatch(redo(canvas))} />
        <button className='toolbar__btn save' onClick={() => {download()}} />
        <button className='toolbar__btn test' onClick={() => {handleHidden()}} />
        <label style={{marginLeft: 10}} htmlFor='line-width'>Line width</label>
      <input 
            onChange={e => dispatch(setLineWidth({lineWidth: e.target.value}))}
            style={{marginLeft: 10}}
            id='line-width'
            type='number'
            value={width}
            min={1}
            max={50} />
      <label style={{margin: 10}} htmlFor='stroke-color'>Stroke color</label>
      <input onChange={e => dispatch(setStrokeColor({strokeColor: e.target.value}))} id='stroke-color' value={stroke} type="color" /> */}

        {/* <BrushButton 
        width={iconsSizes[0]} 
        height={iconsSizes[1]} 
        setOpen={setOpenBrush} 
        open={openBrush}
        figures={setOpenFigures}
        parentRef={brushButtonRef}
        />

        <FiguresButton
        width={iconsSizes[0]} 
        height={iconsSizes[1]} 
        setOpen={setOpenFigures} 
        open={openFigures}
        brush={setOpenBrush}
        parentRef={figuresButtonRef}
        /> */}

        <button onClick={() => {dispatch(setCurrentTool('mymouse'))}}>mouse</button>
        <button onClick={() => {dispatch(setCurrentTool('mybrush'))}}>brush</button>
        <button onClick={() => {dispatch(setCurrentTool('myrect'))}}>rect</button>
        <button onClick={() => {dispatch(setCurrentTool('mycircle'))}}>circle</button>
        <button onClick={() => {dispatch(setCurrentTool('myline'))}}>line</button>
        <button onClick={() => {dispatch(setCurrentTool('myeraser'))}}>eraser</button>

        {/* <EraserButton 
        width={iconsSizes[0]} 
        height={iconsSizes[1]} 
        setOpen={setOpenEraser} 
        open={openEraser}
        figures={setOpenFigures}
        parentRef={brushButtonRef}
        /> */}

        <ClearButton clear={clear}/>

    </div>
  )
}

export default Toolbar