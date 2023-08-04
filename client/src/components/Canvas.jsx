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
import { useCanvases } from "../utilities/CanvasesContext";
import pako from 'pako';

const Canvas = () => {
  // const link = '16.170.240.78'
  const link = 'localhost:5000'
  const { websocket, isConnected } = useWebSocket()
  const { canvases, isChange } = useCanvases()
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()
  const dispatch = useDispatch();
  const userName = useSelector(state => state.canvas.username);
  const userId = useSelector(state => state.canvas.userId);

  useEffect(() => {
    if (userName && isConnected) {

      dispatch(setSessionID(params.id))
      let race = Object.keys(canvases)
      const socket = websocket
      socket.send(JSON.stringify({
        id: params.id,
        username: userName,
        method: 'connection'
      }))

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case "connection":
              console.log(`user ${msg.username} join, user id: ${userId}`)
              break
          case "draw":
            const userID = msg.tool.userid
            let deleteFromArray = race.splice(race.indexOf(userID), 1)
            race.push(userID)
            console.log(race)
            console.log(msg.tool.userid)
            drawHandler(msg)
            break
          case "users":
            const activeUsers = []
            for (let user of Object.keys(msg.users)) {
              activeUsers.push([user, msg.users[user].username])
            }
            dispatch(setUsers(activeUsers))
            console.log(canvases)
            break
        }
      }

      let lastTimestamp = 0;
      const targetFrameRate = 60; // Target frame rate in fps
      const frameInterval = 1000 / targetFrameRate; // Interval in milliseconds

      function drawLoop(timestamp) {
        // Calculate the time elapsed since the last draw
        const elapsed = timestamp - lastTimestamp;

        // Only draw if enough time has passed (e.g., 50ms in your original code)
        if (elapsed >= frameInterval) {
            lastTimestamp = timestamp;

            let sharedCtx = canvasRef.current.getContext('2d');
            sharedCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            for (let canv of race) {
              let s = canvases[canv].settings
              // console.log(s)
              sharedCtx.drawImage(canvases[canv].canvas, s.sX, s.sY, s.sW, s.sH, s.dX, s.dY, s.dW, s.dH)
            }
        }

        // Request the next animation frame
        requestAnimationFrame(drawLoop);
      }

      // Start the animation loop
      requestAnimationFrame(drawLoop);

    }
    
  }, [userName, isConnected, isChange])

  const setSettings = (userid, settings) => {
    canvases[userid].settings = settings
  }

  const drawHandler = (msg) => {
    // const ctx = canvasRef.current.getContext('2d') // delete
    const tool = msg.tool
    const ctx = canvases[tool.userid].canvas.getContext('2d')
    switch (tool.name) {
      case "brush":
        switch (tool.method) {
          case "start":
            ctx.drawImage(canvasRef.current, 0, 0)
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
            ctx.drawImage(canvasRef.current, 0, 0)
            MyBrush.move(ctx, tool.x, tool.y)
            console.log(canvases[tool.userid].settings)
            break
          case "end":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyBrush.end(ctx)
            break
        }
        break
      case "rect":
        switch (tool.method) {
          case "start":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyRect.start(ctx, tool.st, tool.cl, tool.wd)
            break
          case "move":
            ctx.drawImage(canvasRef.current, 0, 0)
            MyRect.move(ctx, tool.x, tool.y, tool.w, tool.h)
            break
          case "end":
            // ctx.drawImage(canvasRef.current, 0, 0)
            MyRect.end(ctx)
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