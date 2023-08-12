import { createCanvas, createFigure, createLog, createEdges } from "./utils"
import MyCircle from "../tools/MyCircle"

const CircleMessagesHandler = (userId, figureId, data, figures, logs, canvases) => {
    let j = logs.length  // log index
    let figure, log, ctx
    switch (data.method) {
        case "start":
            createCanvas(canvases, userId)
            ctx = canvases[userId].getContext('2d')
            MyCircle.start(ctx, data.st, data.cl, data.wd)
            break
        case "move":
            ctx = canvases[userId].getContext('2d')
            MyCircle.move(ctx, data.x, data.y, data.r)
            break
        case "end":
            ctx = canvases[userId].getContext('2d')
            MyCircle.end(ctx)
            log = createLog("circle", userId, figureId, data)
            figures[figureId] = createFigure("circle", userId, data)
            figures[figureId].versions[0].logs[j] = log
            logs.push(log)
            createEdges(figureId, figures)
            delete canvases[userId]
            break
    }
}

export default CircleMessagesHandler