const DrawMessagesHandler = (msg, figures, logs) => {
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
    }
}

export default DrawMessagesHandler