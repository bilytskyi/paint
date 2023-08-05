import DrawBrushHandler from "./DrawBrushHandler"

const LogsHandler = (logs, figures, users, ctx) => {
    for (let log of logs) {
        const user = users[log.user]
        const figure = figures[log.figure]
        switch (figure.type) {
            case "brush":
                DrawBrushHandler(ctx, figure.settings, log.curr, log.prev)
                break
        }
    }
}

export default LogsHandler