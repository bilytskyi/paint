import { createCanvas, createFigure, createLog, createEdges } from "./utils"
import MyRect from "../tools/MyRect"

const RectMessagesHandler = (userId, figureId, data, figures, logs, canvases) => {
    let j = logs.length  // log index
    let figure, log, ctx
    switch (data.method) {
        case "start":
            createCanvas(canvases, userId)
            ctx = canvases[userId].getContext('2d')
            MyRect.start(ctx, data.st, data.cl, data.wd)
            break
        case "move":
            ctx = canvases[userId].getContext('2d')
            MyRect.move(ctx, data.x, data.y, data.w, data.h)
            break
        case "end":
            ctx = canvases[userId].getContext('2d')
            MyRect.end(ctx)
            log = createLog("rect", userId, figureId, data)
            figures[figureId] = createFigure("rect", userId, data)
            figures[figureId].versions[0].logs[j] = log
            logs.push(log)
            createEdges(figureId, figures)
            delete canvases[userId]
            break
    }
}

export default RectMessagesHandler