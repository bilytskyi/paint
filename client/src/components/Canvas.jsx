import React, { useEffect, useRef, useState } from 'react'
import "../styles/canvas.scss"
import { useDispatch, useSelector } from 'react-redux';
import {setCanvas, setData, pushToUndo, setSessionID, setUserName, setSocket, setTestAction} from '../store/canvasSlice';
import {setCurrentTool} from '../store/toolSlice';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Line from '../tools/Line';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import MyBrush from '../tools/MyBrush';
import MyRect from '../tools/MyRect';
import MyCircle from '../tools/MyCircle'
import MyLine from '../tools/MyLine';
import MyEraser from '../tools/MyEraser';
import drawFromMemory from '../utilities/DrawFromMemory';
import GetLink from '../utilities/GetLink';

const Canvas = () => {
  const link = GetLink('prod')
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()
  const dispatch = useDispatch();
  const userName = useSelector(state => state.canvas.username);
  const data = useSelector(state => state.canvas.data)

  const serialize = (canvas) => {
    return canvas.toDataURL();
  }

  // useEffect(() => {
  //   dispatch(setCanvas({canvas: serialize(canvasRef.current)}))
  //   let ctx = canvasRef.current.getContext('2d')
  //       axios.get(`http://localhost:5000/image?id=${params.id}`)
  //           .then(response => {
  //               const img = new Image()
  //               img.src = response.data
  //               img.onload = () => {
  //                   // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  //                   // ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
  //                   ctx.clearRect(0, 0, 1920, 1080)
  //                   ctx.drawImage(img, 0, 0, 1920, 1080)
  //               }
  //           })
  //   console.log(ctx)
  // }, []) 

  useEffect(() => {
    dispatch(setCanvas({canvas: serialize(canvasRef.current)}))
    let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://${link}/text?id=save`)
            .then(response => {
                // drawFromMemory(response.data, canvasRef.current)
                // dispatch(setData(response.data))
                console.log(response.data)

            })
  }, []) 

  useEffect(() => {
    if (userName) {
      axios.post(`http://${link}/users?id=${params.id}`, {user: userName})
      .then(response => console.log(response.data))
      const socket = new WebSocket(`ws://${link}:5000/`)
      // const socket = new WebSocket('ws://16.170.240.78:5000/')
      dispatch(setSessionID(params.id))
      dispatch(setCurrentTool('mybrush'))
      let users = {}
      const actionsQueue = []
      let indexOfQueue = 0
      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: params.id,
          username: userName,
          method: 'connection'
        }))
      }
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data)
        switch (msg.method) {
          case "connection":
              console.log(`user ${msg.username} join`)
              axios.get(`http://${link}/users?id=${params.id}`)
              .then(response => {
                const usersArray = response.data
              // Convert the usersArray to an object and set the default state as "end"
              users = usersArray.reduce((acc, user) => {
                acc[user] = "end"
                return acc
              }, {})
              console.log(users)
              })
              break
          case "draw":
              dispatch(setTestAction(msg))
              drawHandler(msg)
              break
          case "draw2":
            actionsQueue.push(msg)
            console.log(actionsQueue)
            console.log(indexOfQueue)
            if(users[userName] === 'start') {
              console.log('AHTUNG')
            } else {
              for (indexOfQueue; indexOfQueue < actionsQueue.length; indexOfQueue++) {
                drawHandler2(actionsQueue[indexOfQueue])
                memoryHandler(actionsQueue[indexOfQueue])
              }
            }
              break
          case "init":
              drawHandler2(msg)
              break
          case "users":
            const { user, state } = msg;
          if (state === "start" || state === "end") {
            // Toggle the user's state in the users object
            users[user] = state;
            console.log(users);
          }
            break
        }
      }
    }
    
  }, [userName])

  const drawHandler2 = (msg) => {
    dispatch(setTestAction(msg))
    const ctx = canvasRef.current.getContext('2d')
    switch (msg.method) {
      case "init":
        console.log(msg.settings)
        MyRect.init(msg.settings)
        break
      case "draw2":
        switch (msg.tool.name) {
          case "clear":
            ctx.clearRect(0, 0, 1920, 1080)
            break
          case "brush":
            switch (msg.tool.method) {
              case "start1":
                MyBrush.start(ctx, msg.tool.x, msg.tool.y)
                break
              case "end":
                // MyBrush.end(ctx)
                MyBrush.draw(ctx, msg.tool.xy, msg.tool.st, msg.tool.wd)
                break
              case "move1":
                MyBrush.move(ctx, msg.tool.x, msg.tool.y, msg.tool.st, msg.tool.wd)
                break
            }
            break
          case "eraser":
            switch (msg.tool.method) {
              case "start":
                MyEraser.start(ctx, msg.tool.x, msg.tool.y);
                break
              case "stop":
                MyEraser.stop(ctx);
                break
              case "move":
                MyEraser.move(ctx, msg.tool.x, msg.tool.y, msg.tool.wd);
                break
            }
            break
          case "rect":
            switch (msg.tool.method) {
              case "move1":
                MyRect.move(ctx, msg.tool.x, msg.tool.y, msg.tool.x2, msg.tool.y2, msg.tool.cl, msg.tool.st, msg.tool.wd)
                break
              case "end":
                // MyRect.end(ctx)
                MyRect.draw(ctx, msg.tool.x, msg.tool.y, msg.tool.w, msg.tool.h, msg.tool.cl, msg.tool.st, msg.tool.wd)
                break
              case "start1":
                MyRect.start(msg.tool.saved)
                break
            }
            break
          case "circle":
            switch (msg.tool.method) {
              case "move":
                MyCircle.move(ctx, msg.tool.x, msg.tool.y, msg.tool.r, msg.tool.cl, msg.tool.st, msg.tool.wd)
                break
              case "end":
                MyCircle.end(ctx)
                break
              case "start":
                MyCircle.start(msg.tool.saved)
                break
            }
            break
          case "line":
            switch (msg.tool.method) {
              case "move":
                MyLine.move(ctx, msg.tool.x, msg.tool.y, msg.tool.x2, msg.tool.y2, msg.tool.st, msg.tool.wd)
                break
              case "end":
                MyLine.end(ctx)
                break
              case "start":
                MyLine.start(msg.tool.saved)
                break
            }
            break
        }
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

  const drawHandler = (msg) => {
    console.log('drawHandler')
    console.log(msg)
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.width)
        break
      case 'line':
        Line.staticDraw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.color, figure.width)
        break
      case 'rect':
        console.log('rect case draw')
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
        break
      case 'circle':
        console.log('circle case draw')
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color)
        break
      case 'finish':
        ctx.beginPath()
        break
      case 'start':
        ctx.beginPath()
        ctx.moveTo(figure.x, figure.y)
        break
      case 'mybrush':
        new MyBrush({color: figure.color, stroke: figure.stroke, width: figure.width}, msg.id)
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

  // window.addEventListener("resize", resizeCanvas(canvasRef.current));
  // style={{maxHeight:1200,maxWidth:1900,overflow:'scroll'}
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