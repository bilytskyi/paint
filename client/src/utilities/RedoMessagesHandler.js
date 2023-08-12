import LogsHandler from "./LogsHandler"

const RedoMessagesHandler = (userId, figures, logs, canvases) => {
    const figuresKeys = Object.keys(figures)

    for (let i = 0; i < figuresKeys.length; i++) {
        const figure = figures[figuresKeys[i]]
        const version = figure.version
        const user = figure.user
        const status = figure.status
        if (user === userId && status === "undo") {
            for (let j of Object.keys(figure.versions[version].logs)) {
                logs[j] = figure.versions[version].logs[j]
            }
            figure.status = "good"
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            break
        } else {
            continue
        }
    }
}

export default RedoMessagesHandler