import { useDispatch } from 'react-redux';
import { setCurrentTool } from '../../store/toolSlice';

const LineComponent = ({currTool, size, title}) => {
    const dispatch = useDispatch();
    let fillColor = "grey"
    if (currTool === "myline") {
        fillColor = "#10a8ea"
    }
    return (
        <svg onClick={() => {dispatch(setCurrentTool('myline'))}} width={size} height={size} viewBox="0 0 24 24" fill={fillColor}><title>{title}</title><path d="m12.126 8.125 1.937-1.937 3.747 3.747-1.937 1.938zM20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L20.71 7a1 1 0 0 0 0-1.37zM2 5l6.63 6.63L3 17.25V21h3.75l5.63-5.62L18 21l2-2L4 3 2 5z"></path></svg>
    )
}

export default LineComponent