import { useDispatch } from 'react-redux';
import { setCurrentTool } from '../../store/toolSlice';

const RectComponent = ({currTool, size, title}) => {
    const dispatch = useDispatch();
    let fillColor = "grey"
    if (currTool === "myrect") {
        fillColor = "#10a8ea"
    }
    return (
        <svg onClick={() => {dispatch(setCurrentTool('myrect'))}} width={size} height={size} viewBox="0 0 24 24" fill={fillColor}><title>{title}</title><path d="M2 4h20v16H2z"></path></svg>
    )
}

export default RectComponent