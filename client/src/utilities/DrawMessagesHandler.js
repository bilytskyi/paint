import BrushMessagesHandler from "./BrushMessagesHandler"
import RectMessagesHandler from "./RectMessagesHandler"
import CircleMessagesHandler from "./CircleMessagesHandler"
import LineMessagesHandler from "./LineMessagesHandler"
import EraserMessagesHandler from "./EraserMessagesHandler"
import UndoMessagesHandler from "./UndoMessagesHandler"
import RedoMessagesHandler from "./RedoMessagesHandler"
import DraggingMessagesHandler from "./DraggingMessagesHandler"

const createCanvas = (canvases, userId) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    canvases[userId] = canvas
}

const DrawMessagesHandler = (msg, figures, logs, canvases, selectedFigure, testCTX) => {
    const tool = msg.tool
    const userId = tool.userid
    const figureId = tool.figureid
    const figuresKeys = Object.keys(figures)
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
            UndoMessagesHandler(userId, figures, logs, canvases)
            break
        case "redo":
            RedoMessagesHandler(userId, figures, logs, canvases)
            break
        case "dragging":
            DraggingMessagesHandler(userId, figures, tool, selectedFigure, canvases, logs)
            // switch (tool.method) {
            //     case "start":
            //         selectFigure(userId, figures, tool, selectedFigure, canvases)
            //         break
            //     case "move1":
            //         if (selectedFigure.id !== null) {
            //             if (!figures[selectedFigure.id].is_redraw) {
            //                 for (let logIndex of Object.keys(figures[selectedFigure.id].versions[figures[selectedFigure.id].version].logs)) {
            //                     logs[logIndex] = null
            //                 }
            //                 figures[selectedFigure.id].status = "moved"
            //                 canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            //                 LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            //                 figures[selectedFigure.id].is_redraw = true
            //             }
            //             const ctxDraggingMove = canvases[userId].getContext('2d')
            //             const dXY = []
            //             for (let dot of figures[selectedFigure.id].versions[figures[selectedFigure.id].version].xy) {
            //                 const dx = parseInt(tool.dx)
            //                 const dy = parseInt(tool.dy)
            //                 const x = parseInt(dot[0])
            //                 const y = parseInt(dot[1])
            //                 dXY.push([x + dx, y + dy])
            //             }
            //             MyBrush.drawDragging(
            //                 ctxDraggingMove,
            //                 dXY,
            //                 figures[selectedFigure.id].versions[figures[selectedFigure.id].version].settings.stroke,
            //                 figures[selectedFigure.id].versions[figures[selectedFigure.id].version].settings.width
            //             )
            //         }
            //         break
            //     case "end1":
            //         if (selectedFigure.id !== null) {
            //             figures[selectedFigure.id].is_redraw = false
            //             const dxy = []
            //             for (let dot of figures[selectedFigure.id].versions[figures[selectedFigure.id].version].xy) {
            //                 const dx = parseInt(tool.dx)
            //                 const dy = parseInt(tool.dy)
            //                 const x = parseInt(dot[0])
            //                 const y = parseInt(dot[1])
            //                 dxy.push([x + dx, y + dy])
            //             }

            //             const movedLog = {
            //                 timestamp: Date.now(),
            //                 user: userId,
            //                 figure: selectedFigure.id,
            //                 xy: dxy,
            //                 settings: {
            //                     stroke: figures[selectedFigure.id].versions[figures[selectedFigure.id].version].settings.stroke,
            //                     width: figures[selectedFigure.id].versions[figures[selectedFigure.id].version].settings.width
            //                 }
            //             }

            //             const logForMoved = {}
            //             logForMoved[logs.length] = movedLog

            //             logs.push(movedLog)

            //             figures[selectedFigure.id].version = figures[selectedFigure.id].version + 1

            //             figures[selectedFigure.id].versions.push({
            //                 settings: {
            //                     stroke: movedLog.settings.stroke,
            //                     width: movedLog.settings.width
            //                 },
            //                 logs: logForMoved,
            //                 edges: [],
            //                 xy: dxy,
            //                 user: userId
            //             })

            //             const brushFigure2 = figures[selectedFigure.id]

            //             let xMin = Infinity
            //             let xMax = -Infinity
            //             let yMin = Infinity
            //             let yMax = -Infinity

            //             for (let dot of brushFigure2.versions[brushFigure2.version].xy) {
            //                 let x = parseInt(dot[0])
            //                 let y = parseInt(dot[1])

            //                 if (x > xMax) {
            //                     xMax = x
            //                 }
            //                 if (x < xMin) {
            //                     xMin = x
            //                 }
            //                 if (y > yMax) {
            //                     yMax = y
            //                 }
            //                 if (y < yMin) {
            //                     yMin = y
            //                 }
            //             }


            //             brushFigure2.versions[brushFigure2.version].edges.push(xMin - brushFigure2.versions[brushFigure2.version].settings.width / 2 - 3)
            //             brushFigure2.versions[brushFigure2.version].edges.push(xMax + brushFigure2.versions[brushFigure2.version].settings.width / 2 + 3)
            //             brushFigure2.versions[brushFigure2.version].edges.push(yMin - brushFigure2.versions[brushFigure2.version].settings.width / 2 - 3)
            //             brushFigure2.versions[brushFigure2.version].edges.push(yMax + brushFigure2.versions[brushFigure2.version].settings.width / 2 + 3)

            //             selectedFigure.id = null
            //             delete canvases[userId]
            //         }
            //         break
            // }
        break
    }
}

export default DrawMessagesHandler