import "../styles/canvas.scss"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {setCanvas, setUsers, setData, setUserId, pushToUndo, setSessionID, setUserName, setSocket, setTestAction} from '../store/canvasSlice';
import {setCurrentTool} from '../store/toolSlice';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import MyBrush from '../tools/MyBrush';
import MyRect from '../tools/MyRect';
import MyCircle from '../tools/MyCircle'
import MyLine from '../tools/MyLine';
import MyEraser from '../tools/MyEraser';
import { useWebSocket } from '../utilities/WebSocketContext';
// import { useCanvases } from "../utilities/CanvasesContext";
import DrawMessagesHandler from "../utilities/DrawMessagesHandler";
import LogsHandler from "../utilities/LogsHandler";
import OffscreenCanvasesHandler from "../utilities/OffscreenCanvasesHandler";

const Canvas = () => {
  // const link = '16.170.240.78'
  const link = 'localhost:5000'
  const { websocket, isConnected } = useWebSocket()
  // const { canvases, isChange } = useCanvases()
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()
  const dispatch = useDispatch();
  const userName = useSelector(state => state.canvas.username);
  const userId = useSelector(state => state.canvas.userId);
  const activeUsers = useSelector(state => state.canvas.users)

  useEffect(() => {
    if (userName && isConnected) {
      dispatch(setCurrentTool('mymouse'))
      dispatch(setCurrentTool('mybrush'))
      dispatch(setCurrentTool('mymouse'))
      const selectedFigure = {id: null}

      const offCanvas = document.createElement("canvas")
      offCanvas.width = 1920
      offCanvas.height = 1080
      const offCtx = offCanvas.getContext("2d")

      const canvases = {}
      canvases["main"] = offCanvas

      const figures = {}
      const logs = []
      const users = {}
      const OffscreenCanvases = {}
      OffscreenCanvases["main"] = {
        canvas: offCanvas,
        ctx: offCanvas.getContext("2d")
      }
      dispatch(setSessionID(params.id))
      const socket = websocket
      socket.send(JSON.stringify({
        id: params.id,
        username: userName,
        method: 'connection'
      }))

      socket.onmessage = async (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case "connection":
              console.log(`user ${msg.username} join, user id: ${userId}`)
              // LogsHandler(logs, figures, offCtx)
              break
          case "draw":
            DrawMessagesHandler(msg, figures, logs, canvases, selectedFigure, offCtx)
            // console.log(logs)
            console.log(figures)
            break
          case "users":
            for (let user of Object.keys(msg.users)) {
              if (!users[user]) {
                users[user] = msg.users[user].username
              }
            }
            // dispatch(setUsers(users))
            // console.log(users)
            // console.log(activeUsers)
            break
        }
      }

      let lastTimestamp = 0;
      const targetFrameRate = 60; 
      const frameInterval = 1000 / targetFrameRate; 

      function drawLoop(timestamp) {
        
        const elapsed = timestamp - lastTimestamp;

        
        if (elapsed >= frameInterval) {
            lastTimestamp = timestamp;

            let sharedCtx = canvasRef.current.getContext('2d');
            sharedCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            sharedCtx.fillStyle = "#ffffff"
            sharedCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

            // offCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            LogsHandler(logs.slice(-25), figures, offCtx)
            for (let canvas of Object.keys(canvases)) {
              sharedCtx.drawImage(canvases[canvas], 0, 0)
            }
        }

        
        requestAnimationFrame(drawLoop);
      }

      
      requestAnimationFrame(drawLoop);

    }
    
  }, [userName, isConnected])

  // useEffect(() => {
  //   if (userName && isConnected) {

  //     dispatch(setSessionID(params.id))
  //     let race = Object.keys(canvases)
  //     let race2 = Object.keys(canvases)
  //     let deleteFromArray = race2.splice(race2.indexOf(userId), 1)
  //     race2.push(userId)
  //     const socket = websocket
  //     socket.send(JSON.stringify({
  //       id: params.id,
  //       username: userName,
  //       method: 'connection'
  //     }))

  //     socket.onmessage = (event) => {
  //       let msg = JSON.parse(event.data)
  //       switch (msg.method) {
  //         case "connection":
  //             console.log(`user ${msg.username} join, user id: ${userId}`)
  //             break
  //         case "draw":
  //           const userID = msg.tool.userid
  //           let deleteFromArray = race.splice(race.indexOf(userID), 1)
  //           race.push(userID)
  //           console.log(race)
  //           console.log(msg.tool.userid)
  //           drawHandler(msg)
  //           console.log(shapes)
  //           break
  //         case "users":
  //           const activeUsers = []
  //           for (let user of Object.keys(msg.users)) {
  //             activeUsers.push([user, msg.users[user].username])
  //           }
  //           dispatch(setUsers(activeUsers))
  //           console.log(canvases)
  //           break
  //       }
  //     }

  //     let lastTimestamp = 0;
  //     const targetFrameRate = 60; // Target frame rate in fps
  //     const frameInterval = 1000 / targetFrameRate; // Interval in milliseconds

  //     function drawLoop(timestamp) {
  //       // Calculate the time elapsed since the last draw
  //       const elapsed = timestamp - lastTimestamp;

  //       // Only draw if enough time has passed (e.g., 50ms in your original code)
  //       if (elapsed >= frameInterval) {
  //           lastTimestamp = timestamp;

  //           let sharedCtx = canvasRef.current.getContext('2d');
  //           // const clientCtx = canvases[userId].canvas.getContext('2d')
  //           sharedCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  //           for (let shape of shapes) {
  //             drawShapes(shape, sharedCtx)
  //           }
            
  //           for (let canv of race) {
  //             sharedCtx.drawImage(canvases[canv].canvas, 0, 0)
  //           }

  //           // for (let shape of shapes) {
  //           //   drawShapes(shape, sharedCtx)
  //           // }

  //       }

  //       // Request the next animation frame
  //       requestAnimationFrame(drawLoop);
  //     }

  //     // Start the animation loop
  //     requestAnimationFrame(drawLoop);

  //   }
    
  // }, [userName, isConnected, isChange])

  const setSettings = (userid, settings) => {
    canvases[userid].settings = settings
  }

  const drawShapes = (shape, ctx) => {
    const name = shape.name
    switch (name) {
      case "brush":
        MyBrush.draw(ctx, shape.xy, shape.st, shape.wd)
        break
      case "rect":
        MyRect.draw(ctx, shape.x, shape.y, shape.w, shape.h, shape.st, shape.wd, shape.cl)
        break
    }
  }

  const drawHandler = (msg) => {
    // const ctx = canvasRef.current.getContext('2d') // delete
    const tool = msg.tool
    const ctx = canvases[tool.userid].canvas.getContext('2d')
    switch (tool.name) {
      case "brush":
        switch (tool.method) {
          case "start":
            for (let shape of shapes) {
              drawShapes(shape, ctx)
            }
            MyBrush.start(ctx, tool.x, tool.y, tool.st, tool.wd)
            break
          case "move":
            let settings = {
              sX: tool.x - 6,
              sY: tool.y - 6,
              sW: 12,
              sH: 12,
              dX: tool.x - 6,
              dY: tool.y - 6,
              dW: 12,
              dH: 12,
            }
            // setSettings(tool.userid, settings)
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyBrush.move(ctx, tool.x, tool.y)
            break
          case "end":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyBrush.end(ctx)
            shapes.push(tool)
            for (let shape of shapes) {
              drawShapes(shape, ctx)
            }
            break
        }
        break
      case "rect":
        switch (tool.method) {
          case "start":
            for (let shape of shapes) {
              drawShapes(shape, ctx)
            }
            MyRect.start(ctx, tool.st, tool.cl, tool.wd)
            break
          case "move":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyRect.move(ctx, tool.x, tool.y, tool.w, tool.h)
            break
          case "end":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyRect.end(ctx)
            shapes.push(tool)
            for (let shape of shapes) {
              drawShapes(shape, ctx)
            }
            break
        }
        break
      case "line":
        MyLine.draw(ctx, tool.x, tool.y, tool.x2, tool.y2, tool.st, tool.wd)
        break
      case "circle":
        MyCircle.draw(ctx, tool.x, tool.y, tool.r, tool.cl, tool.st, tool.wd)
        break
      case "eraser":
        MyEraser.draw(ctx, tool.xy, tool.wd)
        break
      case "clear":
        ctx.clearRect(0, 0, 1920, 1080)
        break
    }
  }


  const mouseDownHandler = () => {
    // dispatch(pushToUndo(canvasRef.current.toDataURL()))
    // axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
    //   .then(response => console.log(response.data))
  }

  const connectionHandler = () => {
    dispatch(setUserName(usernameRef.current.value))
    dispatch(setUserId(`${(+new Date()).toString(16)}`))
    setModal(false)
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      connectionHandler();
    }
  }

  return (
    <div className='canvas' >
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text' ref={usernameRef} onKeyDown={handleKeyPress}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas id='canvas' onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1920} height={1080} />
    </div>
  )
}

export default Canvas