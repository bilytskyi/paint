import LogsHandler from "./LogsHandler"

const UndoMessagesHandler = (userId, figures, logs, canvases) => {
    const figuresKeys = Object.keys(figures)

    for (let i = figuresKeys.length - 1; i >= 0; i--) {
        const figure = figures[figuresKeys[i]]
        const version = figure.version
        const user = figure.user
        const status = figure.status
        if (user === userId && status !== "undo") {
            for (let j of Object.keys(figure.versions[version].logs)) {
                logs[j] = null
            }
            figure.status = "undo"
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            break
        } else {
            continue
        }
    }
}

export default UndoMessagesHandler


// if (figures[figuresKeys[i]].user === userId && figures[figuresKeys[i]].status === "moved") {
        //     for (let logIndex of Object.keys(figures[figuresKeys[i]].versions[figures[figuresKeys[i]].version].logs)) {
        //         logs[logIndex] = null
        //     }
        //     figures[figuresKeys[i]].version = figures[figuresKeys[i]].version - 1
        //     canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
        //     // log of version become != null
        //     logs[Object.keys(figures[figuresKeys[i]].versions[figures[figuresKeys[i]].version].logs)[0]] = figures[figuresKeys[i]].versions[figures[figuresKeys[i]].version].logs[Object.keys(figures[figuresKeys[i]].versions[figures[figuresKeys[i]].version].logs)]
        //     LogsHandler(logs, figures, canvases["main"].getContext('2d'))
        //     break
        // }