import "../styles/canvas.scss"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {setCanvas, setData, pushToUndo, setSessionID, setUserName, setSocket, setTestAction} from '../store/canvasSlice';
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

const Canvas = () => {
  // const link = '16.170.240.78'
  const link = 'localhost:5000'
  const { websocket, isConnected } = useWebSocket()
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()
  const dispatch = useDispatch();
  const userName = useSelector(state => state.canvas.username);

  useEffect(() => {
    if (userName && isConnected) {

      axios.post(`http://${link}/users?id=${params.id}-users`, {user: userName})
      .then(response => console.log(response.data))
      dispatch(setSessionID(params.id))

      const socket = websocket
      let users = {}
      let actionsQueue = []
      const compressQueue = []
      let indexOfQueue = 0

      socket.send(JSON.stringify({
        id: params.id,
        username: userName,
        method: 'connection'
      }))

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case "connection":
              console.log(`user ${msg.username} join`)
              axios.get(`http://${link}/users?id=${params.id}-users`)
              .then(response => {
                const usersArray = response.data
                console.log("Received usersArray:", usersArray)
                users = usersArray.reduce((acc, user) => {
                acc[user] = "end"
                return acc
              }, {})

              axios.get(`http://${link}/actions?id=${params.id}-actions`)
              .then(response => {
                actionsQueue = JSON.parse(response.data)
                console.log("Received actionsQueue:", actionsQueue)
                for (indexOfQueue; indexOfQueue < actionsQueue.length; indexOfQueue++) {
                  console.log(indexOfQueue)
                  const msg = actionsQueue[indexOfQueue]
                    drawHandler(msg)
                  }
              }, {})

              console.log(users)
              })
              break
          case "heartbeat":
            console.log("heartbeat")
            break
          case "draw":
            // compressionHandler(msg, compressQueue)
            handleDrawMessage(msg, actionsQueue)
            // console.log(compressQueue)
            // console.log(JSON.stringify(compressQueue))
            break
          case "users":
            const { user, state } = msg;
          if (state === "start" || state === "end") {
            users[user] = state;
            console.log(users);
            let filteredMsgs = actionsQueue.filter((msg) => msg.tool && msg.tool.user === userName)
            console.log(filteredMsgs)
            console.log(actionsQueue)
            console.log(JSON.stringify(actionsQueue))
            console.log(indexOfQueue)
            if(users[userName] === 'start') {
              console.log('AHTUNG')
            } else {
              for (indexOfQueue; indexOfQueue < actionsQueue.length; indexOfQueue++) {
                const msg = actionsQueue[indexOfQueue]
                if (user === userName) {
                  console.log('continue')
                  continue
                } else {
                  console.log('helloo else')
                  drawHandler(msg)
                  memoryHandler(msg)
                }
              }
            }
          }
            break
        }
      }
    }
    
  }, [userName, isConnected])

  const handleDrawMessage = async (msg, arr) => {
    arr.push(msg);
    try {
        const response = await axios.post(`http://${link}/actions?id=${params.id}-actions`, {data: JSON.stringify(arr)});
        console.log(JSON.stringify(arr))
        console.log(response.data);
    } catch (error) {
        console.error("Error while saving actions:", error);
    }
}

  // const compressionHandler = (msg, array) => {
  //   const tool = msg.tool
  //   console.log(tool.name)
  //   switch (tool.name) {
  //     case "brush":
  //       let chunk = `A,${tool.xy},${tool.st},${tool.wd},${tool.user}`
  //       array.push(chunk)
  //       break
  //     case "rect":
  //       MyRect.draw(ctx, tool.x, tool.y, tool.w, tool.h, tool.cl, tool.st, tool.wd)
  //       break
  //     case "line":
  //       MyLine.draw(ctx, tool.x, tool.y, tool.x2, tool.y2, tool.st, tool.wd)
  //       break
  //     case "circle":
  //       MyCircle.draw(ctx, tool.x, tool.y, tool.r, tool.cl, tool.st, tool.wd)
  //       break
  //     case "eraser":
  //       MyEraser.draw(ctx, tool.xy, tool.wd)
  //       break
  //     case "clear":
  //       ctx.clearRect(0, 0, 1920, 1080)
  //       break
  //   }
  // }

  const drawHandler = (msg) => {
    const ctx = canvasRef.current.getContext('2d')
    const tool = msg.tool
    console.log(tool.name)
    switch (tool.name) {
      case "brush":
        MyBrush.draw(ctx, tool.xy, tool.st, tool.wd)
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

  const memoryHandler = (msg) => {
    const tool = msg.tool
    let chunk = ''
    switch (tool.name){
      case "brush": 
      switch (tool.method) {
        case "start":
          chunk = `A,${tool.x},${tool.y};`
          // chunk = `A${tool.x}${tool.y};`
          // dispatch(setData(chunk))
          break
        case "move":
          chunk = `B,${tool.x},${tool.y},${tool.st},${tool.wd};`
          // chunk = `${tool.st}${tool.wd}B${tool.x}${tool.y};`
          // dispatch(setData(chunk))
          break
        case "end":
          chunk = `C;`
          // chunk = `C;`
          dispatch(setData(`${tool.xy}-${tool.st},${tool.wd};`))
          break
      }
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
    setModal(false)
  }

  return (
    <div className='canvas' >
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Enter your name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type='text' ref={usernameRef}/>
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