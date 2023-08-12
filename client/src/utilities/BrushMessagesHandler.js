import { createFigure, createLog, createEdges } from "./utils"

const BrushMessagesHandler = (userId, figureId, data, figures, logs) => {
    let j = logs.length  // log index
    let figure, log
    switch (data.method) {
        case "start":
            figure = createFigure("brush", userId, data)
            log = createLog("brush", userId, figureId, data)
            figure.versions[0].logs[j] = log
            figures[figureId] = figure
            figures[figureId].versions[0].xy.push(data.curr)                  
            logs.push(log)
            break
        case "move":
            figures[figureId].versions[0].xy.push(data.curr)
            log = createLog("brush", userId, figureId, data)
            figures[figureId].versions[0].logs[j] = log
            logs.push(log)
            break
        case "end":
            createEdges(figureId, figures)
            break
    }
}

export default BrushMessagesHandler