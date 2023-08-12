import MyCircle from "../tools/MyCircle"
import MyLine from "../tools/MyLine"
import MyRect from "../tools/MyRect"
import MyBrush from "../tools/MyBrush"
import DrawBrushHandler from "./DrawBrushHandler"

const LogsHandler = (logs, figures, ctx) => {
    for (let log of logs) {
        if (log === null) {
            continue
        }
        const figure = figures[log.figure]
        switch (figure.type) {
            case "brush":
                if (figure.version === 0) {
                    DrawBrushHandler(ctx, figure.versions[0].settings, log.curr, log.prev)
                } else {
                    MyBrush.draw(
                        ctx,
                        log.settings.xy,
                        log.settings.stroke,
                        log.settings.width
                    )
                }
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
                DrawBrushHandler(ctx, figure.versions[0].settings, log.curr, log.prev)
                break

        }
    }
}

export default LogsHandler