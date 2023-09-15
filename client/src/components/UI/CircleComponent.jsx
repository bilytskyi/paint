import { useDispatch } from 'react-redux';
import { setCurrentTool } from '../../store/toolSlice';

const CircleComponent = ({currTool, size, title}) => {
    const dispatch = useDispatch();
    let fillColor = "grey"
    if (currTool === "mycircle") {
        fillColor = "#10a8ea"
    }
    return (
        <svg onClick={() => {dispatch(setCurrentTool('mycircle'))}} width={size} height={size} viewBox="0 0 24 24" fill={fillColor}><title>{title}</title><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"></path></svg>
    )
}

export default CircleComponent