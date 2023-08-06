import MyCircle from "../tools/MyCircle"
import MyLine from "../tools/MyLine"
import MyRect from "../tools/MyRect"
import DrawBrushHandler from "./DrawBrushHandler"

const LogsHandler = (logs, figures, users, ctx) => {
    for (let log of logs) {
        const user = users[log.user]
        const figure = figures[log.figure]
        switch (figure.type) {
            case "brush":
                DrawBrushHandler(ctx, figure.settings, log.curr, log.prev)
                break
            case "rect":
                MyRect.draw(
                    ctx,
                    log.settings.data[0],
                    log.settings.data[1],
                    log.settings.data[2],
                    log.settings.data[3],
                    log.settings.stroke,
                    log.settings.width,
                    log.settings.color
                )
                break
            case "circle":
                MyCircle.draw(
                    ctx,
                    log.settings.data[0],
                    log.settings.data[1],
                    log.settings.data[2],
                    log.settings.stroke,
                    log.settings.width,
                    log.settings.color
                )
                break
            case "line":
                MyLine.draw(
                    ctx,
                    log.settings.data[0],
                    log.settings.data[1],
                    log.settings.data[2],
                    log.settings.data[3],
                    log.settings.stroke,
                    log.settings.width
                )
                break
            case "eraser":
                DrawBrushHandler(ctx, figure.settings, log.curr, log.prev)
                break

        }
    }
}

export default LogsHandler