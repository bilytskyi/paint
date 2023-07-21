import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTool, setLineWidth, setFillColor, setStrokeColor } from '../../store/toolSlice';
import { useEffect, useRef } from 'react';

const FiguresButton = ({width, height, setOpen, open, parentRef, brush}) => {
    const dispatch = useDispatch();
    const currentTool = useSelector(state => state.tool.toolsSetting.currentTool)
    const lineWidth = useSelector(state => state.tool.toolsSetting[currentTool].width)
    const color = useSelector(state => state.tool.toolsSetting[currentTool].color)
    const childRef = useRef()
    const stroke = useSelector(state => state.tool.toolsSetting[currentTool].stroke)
    let defaultColor = "#4D4D4D"
    if (currentTool === 'circle' || currentTool === 'rect' || currentTool === 'line') {
        defaultColor = "blue"
    }
    useEffect(() => {
        parentRef.current = childRef.current
    }, [parentRef])

    let text

    switch (currentTool) {
        case 'rect':
            text = 'rect stroke width:'
            break
        case 'circle':
            text = 'circle stroke width:'
            break
        case 'line':
            text = 'line width:'
            break
        default:
            text = 'choose your figure'
    }

    return (
        <div ref={childRef}>
        <button className='toolbar__btn' onClick={() => {setOpen(!open), brush(false)}}>
        <svg width={width} height={height} viewBox="0 0 24 24" fill={defaultColor} xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.25C3.48122 3.25 2.25 4.48122 2.25 6V15C2.25 16.5188 3.48122 17.75 5 17.75H6.30098C7.28733 21.3525 10.5845 24 14.5 24C19.1944 24 23 20.1944 23 15.5C23 11.5845 20.3525 8.28733 16.75 7.30098V6C16.75 4.48122 15.5188 3.25 14 3.25H5ZM15.25 7.03263V6C15.25 5.30964 14.6904 4.75 14 4.75H5C4.30964 4.75 3.75 5.30964 3.75 6V15C3.75 15.6904 4.30964 16.25 5 16.25H6.03263C6.01103 16.0029 6 15.7527 6 15.5C6 10.8056 9.80558 7 14.5 7C14.7527 7 15.0029 7.01103 15.25 7.03263Z"></path></svg>
        </button>
        { open && (
        <div className='toolbar__figures__setting'>
            <div class="figures">
                    <svg onClick={() => {dispatch(setCurrentTool('rect'))}} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#4D4D4D" stroke-width="2" fill="#ffffff"></rect></svg>
                    <svg onClick={() => {dispatch(setCurrentTool('circle'))}} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#4D4D4D" stroke-width="2" fill="#ffffff"></circle></svg>
                    <svg onClick={() => {dispatch(setCurrentTool('line'))}} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="3.24658" y1="19.8392" x2="20.3391" y2="2.74666" stroke="#4D4D4D" stroke-width="2" stroke-linecap="round"></line></svg>
                </div>
                <label htmlFor="figures-range">{text}</label>
                <input 
                type="range" 
                min={1} 
                max={50} 
                id="figures-range"
                onChange={e => dispatch(setLineWidth({lineWidth: e.target.value}))}
                value={lineWidth}/>
                {(currentTool === 'rect' || currentTool === 'circle') &&
                    (
                        <div>
                <label htmlFor="stroke">fill color: </label>
                <br/>
                <input onChange={e => dispatch(setFillColor({fillColor: e.target.value}))} type='color' value={color}/>
                </div>
                    )
                }
                
                <label htmlFor="fill">color: </label>
                <br/>
                <input onChange={e => dispatch(setStrokeColor({strokeColor: e.target.value}))} type='color' value={stroke}/>
                
        </div>
        )}
        </div>
    )
}

export default FiguresButton