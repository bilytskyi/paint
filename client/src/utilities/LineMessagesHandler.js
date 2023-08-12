import { createCanvas, createFigure, createLog, createEdges } from "./utils"
import MyLine from "../tools/MyLine"

const LineMessagesHandler = (userId, figureId, data, figures, logs, canvases) => {
    let j = logs.length  // log index
    let figure, log, ctx
    switch (data.method) {
        case "start":
            createCanvas(canvases, userId)
            ctx = canvases[userId].getContext('2d')
            MyLine.start(ctx, data.st, data.wd)
            break
        case "move":
            ctx = canvases[userId].getContext('2d')
            MyLine.move(ctx, data.x, data.y, data.x2, data.y2)
            break
        case "end":
            ctx = canvases[userId].getContext('2d')
            MyLine.end(ctx)
            log = createLog("line", userId, figureId, data)
            figures[figureId] = createFigure("line", userId, data)
            figures[figureId].versions[0].logs[j] = log
            logs.push(log)
            createEdges(figureId, figures)
            delete canvases[userId]
            break
    }
}

export default LineMessagesHandler