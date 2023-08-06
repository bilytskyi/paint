import MyRect from "../tools/MyRect"
const DrawMessagesHandler = (msg, figures, logs, canvases, OffscreenCanvases) => {
    const tool = msg.tool
    const userId = tool.userid
    const figureId = tool.figureid
    const canvas = OffscreenCanvases[userId].canvas
    const ctx = OffscreenCanvases[userId].ctx
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
                    MyRect.start(ctx, tool.st, tool.cl, tool.wd)
                    break
                case "move":
                    MyRect.move(ctx, tool.x, tool.y, tool.w, tool.h)
                    break
                case "end":
                    MyRect.end(ctx)
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
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    break
            }
        break
    }
}

export default DrawMessagesHandler