import { useState } from "react"
import Canvas from "./components/Canvas"
import SettingBar from "./components/SettingBar"
import Toolbar from "./components/Toolbar";
import "./styles/app.scss"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { WebSocketProvider } from "./utilities/WebSocketContext";
import { CanvasesProvider } from "./utilities/CanvasesContext";

function App() {

  return (
    <CanvasesProvider>
    <WebSocketProvider>
    <BrowserRouter>
    <>
    <Routes>
  <Route path='/:id' element={<><Toolbar/><Canvas /></>} />
  <Route path='/' element={<><Toolbar/><Canvas /><Navigate to={`/f${(+new Date()).toString(16)}`} replace/></>} />
</Routes>
    </>
    </BrowserRouter>
    </WebSocketProvider>
    </CanvasesProvider>
  )
}

export default App
