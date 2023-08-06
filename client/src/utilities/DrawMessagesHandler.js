import MyRect from "../tools/MyRect"

const createCanvas = (canvases, userId) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    canvases[userId] = canvas
}

const DrawMessagesHandler = (msg, figures, logs, canvases) => {
    const tool = msg.tool
    const userId = tool.userid
    const figureId = tool.figureid
    switch (tool.name) {
        case "brush":
            switch (tool.method) {
                case "start":
                    const figure = {
                        type: "brush",
                        settings: {
                            stroke: tool.st,
                            width: tool.wd
                        },
                        xy: [],
                        user: userId
                    }
                    figures[figureId] = figure
                    figures[figureId].xy.push(tool.curr)
                    const startLog = {
                        timestamp: Date.now(),
                        user: userId,
                        figure: figureId,
                        curr: tool.curr,
                        prev: tool.prev,
                    }
                    logs.push(startLog)
                    break
                case "move":
                    figures[figureId].xy.push(tool.curr)
                    const moveLog = {
                        timestamp: Date.now(),
                        user: userId,
                        figure: figureId,
                        curr: tool.curr,
                        prev: tool.prev,
                    }
                    logs.push(moveLog)
                    break
                case "end":
                    break
            }
        break
        case "rect":
            switch (tool.method) {
                case "start":
                    createCanvas(canvases, userId)
                    const ctxRectStart = canvases[userId].getContext('2d')
                    MyRect.start(ctxRectStart, tool.st, tool.cl, tool.wd)
                    break
                case "move":
                    const ctxRectMove = canvases[userId].getContext('2d')
                    MyRect.move(ctxRectMove, tool.x, tool.y, tool.w, tool.h)
                    break
                case "end":
                    const ctxRectEnd = canvases[userId].getContext('2d')
                    MyRect.end(ctxRectEnd)
                    const figure = {
                        type: "rect",
                        settings: {
                            color: tool.cl,
                            stroke: tool.st,
                            width: tool.wd,
                            data: [tool.x, tool.y, tool.w, tool.h]
                        },
                        user: userId
                    }
                    figures[figureId] = figure
                    const endLog = {
                        timestamp: Date.now(),
                        user: userId,
                        figure: figureId,
                        settings: {
                            color: tool.cl,
                            stroke: tool.st,
                            width: tool.wd,
                            data: [tool.x, tool.y, tool.w, tool.h]
                        }
                    }
                    logs.push(endLog)
                    delete canvases[userId]
                    break
            }
        break
    }
}

export default DrawMessagesHandler