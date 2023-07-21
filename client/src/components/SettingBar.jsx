import React from 'react'
import "../styles/setting-bar.scss"
import {setLineWidth, setStrokeColor} from '../store/toolSlice';
import { useDispatch, useSelector } from 'react-redux';

const SettingBar = () => {
  const dispatch = useDispatch();
  const currentTool = useSelector(state => state.tool.toolsSetting.currentTool)
  const width = useSelector(state => state.tool.toolsSetting[currentTool].width)
  const stroke = useSelector(state => state.tool.toolsSetting[currentTool].stroke)
  const canvas = document.getElementById("canvas");
  return (
    <div className='setting-bar'>
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
      <input onChange={e => dispatch(setStrokeColor({strokeColor: e.target.value}))} id='stroke-color' value={stroke} type="color" />
    </div>
  )
}

export default SettingBar