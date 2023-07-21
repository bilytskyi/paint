import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTool, setLineWidth, setFillColor } from '../../store/toolSlice';
import { useEffect, useRef } from 'react';

const BrushButton = ({width, height, setOpen, open, parentRef, figures}) => {
    const dispatch = useDispatch();
    const currentTool = useSelector(state => state.tool.toolsSetting.currentTool)
    const lineWidth = useSelector(state => state.tool.toolsSetting['brush'].width)
    const color = useSelector(state => state.tool.toolsSetting['brush'].color)
    const childRef = useRef()
    let defaultColor = "#4D4D4D"
    if (currentTool === 'brush') {
        defaultColor = "blue"
    }
    useEffect(() => {
        parentRef.current = childRef.current
    }, [parentRef])
    return (
        <div ref={childRef}>
        <button className='toolbar__btn' onClick={() => {dispatch(setCurrentTool('brush')); setOpen(!open); figures(false)}}>
            <svg width={width} height={height} viewBox="0 0 24 24" fill={defaultColor} xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.369 2.8034C16.9776 2.41382 16.3444 2.41534 15.9548 2.80681L14.544 4.22442C14.1544 4.61589 14.156 5.24905 14.5474 5.63863L18.0915 9.16564C18.4829 9.55522 19.1161 9.5537 19.5057 9.16223L20.9165 7.74462C21.3061 7.35315 21.3045 6.71999 20.9131 6.33041L17.369 2.8034ZM13.8419 6.34785C13.4504 5.95822 12.8172 5.9598 12.4276 6.35137L2.84577 15.9826C2.65875 16.1706 2.55405 16.4251 2.55469 16.6903L2.56321 20.2259C2.56454 20.7782 3.01333 21.2248 3.56561 21.2235L7.10104 21.215C7.36631 21.2143 7.62046 21.1083 7.80756 20.9203L17.3895 11.2889C17.779 10.8975 17.7774 10.2644 17.386 9.87485L13.8419 6.34785Z"></path></svg>
        </button>
        { open && (
        <div className='toolbar__brush__setting'>
            <label htmlFor="brush-range">brush width: </label>
                <input 
                type="range" 
                min={1} 
                max={50} 
                id="brush-range"
                onChange={e => dispatch(setLineWidth({lineWidth: e.target.value}))}
                value={lineWidth}/>
                <label htmlFor="head">brush color: </label>
                <br/>
                <input onChange={e => dispatch(setFillColor({fillColor: e.target.value}))} type='color' value={color}/>
        </div>
        )}
        </div>
    )
}

export default BrushButton