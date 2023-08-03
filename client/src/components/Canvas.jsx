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

      setInterval(() => {
        for (let canv of Object.keys(canvases)) {
          let ctx = canvasRef.current.getContext('2d')
          ctx.drawImage(canvases[canv].canvas, 0, 0)
        }
      }, 25)

    }
    
  }, [userName, isConnected, isChange])

  const drawHandler = (msg) => {
    // const ctx = canvasRef.current.getContext('2d') // delete
    const tool = msg.tool
    const ctx = canvases[tool.userid].canvas.getContext('2d')
    console.log(tool.name)
    switch (tool.name) {
      case "brush":
        switch (tool.method) {
          case "start":
            MyBrush.start(ctx, tool.x, tool.y, tool.st, tool.wd)
            break
          case "move":
            MyBrush.move(ctx, tool.x, tool.y)
            break
          case "end":
            MyBrush.end(ctx)
            break
        }
        break
      case "rect":
        MyRect.draw(ctx, tool.x, tool.y, tool.w, tool.h, tool.cl, tool.st, tool.wd)
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