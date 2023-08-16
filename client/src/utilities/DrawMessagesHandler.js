import BrushMessagesHandler from "./BrushMessagesHandler"
import RectMessagesHandler from "./RectMessagesHandler"
import CircleMessagesHandler from "./CircleMessagesHandler"
import LineMessagesHandler from "./LineMessagesHandler"
import EraserMessagesHandler from "./EraserMessagesHandler"
import UndoMessagesHandler from "./UndoMessagesHandler"
import RedoMessagesHandler from "./RedoMessagesHandler"
import DraggingMessagesHandler from "./DraggingMessagesHandler"
import ActionsHandler from "./ActionsHandler"

const DrawMessagesHandler = (msg, figures, logs, canvases, selectedFigure, actions) => {
    const tool = msg.tool
    const userId = tool.userid
    const figureId = tool.figureid
    switch (tool.name) {
        case "brush":
            BrushMessagesHandler(userId, figureId, tool, figures, logs)
            break
        case "rect":
            RectMessagesHandler(userId, figureId, tool, figures, logs, canvases)
            break
        case "circle":
            CircleMessagesHandler(userId, figureId, tool, figures, logs, canvases)
            break
        case "line":
            LineMessagesHandler(userId, figureId, tool, figures, logs, canvases)
            break
        case "eraser":
            EraserMessagesHandler(userId, figureId, tool, figures, logs)
            break
        case "clear":
            logs.length = 0;
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
        break
        case "undo":
            // UndoMessagesHandler(userId, figures, logs, canvases)
            UndoMessagesHandler(actions, figures, logs, canvases)
            break
        case "redo":
            // RedoMessagesHandler(userId, figures, logs, canvases)
            RedoMessagesHandler(actions, figures, logs, canvases)
            break
        case "dragging":
            DraggingMessagesHandler(userId, figures, tool, selectedFigure, canvases, logs)
            break
    }

    if (tool.method === "end") {
        ActionsHandler(figures, actions, figureId, selectedFigure, tool.name)
    }
}

export default DrawMessagesHandler