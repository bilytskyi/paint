import { useState } from "react"
import Canvas from "./components/Canvas"
import SettingBar from "./components/SettingBar"
import Toolbar from "./components/Toolbar";
import "./styles/app.scss"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
    <>
    <Routes>
  <Route path='/:id' element={<><Toolbar/><Canvas /></>} />
  <Route path='/' element={<><Toolbar/><Canvas /><Navigate to={`/f${(+new Date()).toString(16)}`} replace/></>} />
</Routes>
    </>
    </BrowserRouter>
  )
}

export default App
