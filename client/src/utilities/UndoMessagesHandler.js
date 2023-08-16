// import LogsHandler from "./LogsHandler"

// const UndoMessagesHandler = (userId, figures, logs, canvases) => {
//     const figuresKeys = Object.keys(figures)

//     for (let i = figuresKeys.length - 1; i >= 0; i--) {
//         let figure = figures[figuresKeys[i]]
//         let version = figure.version
//         let user = figure.user
//         let status = figure.status
//         if (version === 0) {
//             if (user === userId && status !== "undo") {
//                 for (let j of Object.keys(figure.versions[version].logs)) {
//                     logs[j] = null
//                 }
//                 figure.status = "undo"
//                 canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
//                 LogsHandler(logs, figures, canvases["main"].getContext('2d'))
//                 break
//             } else {
//                 continue
//             }
//         } else {
//             if (user === userId) {
//                 for (let j of Object.keys(figure.versions[version].logs)) {
//                     logs[j] = null
//                 }
//                 figure.version = version - 1
//                 version = figure.version
//                 for (let j of Object.keys(figure.versions[version].logs)) {
//                     logs[j] = figure.versions[version].logs[j]
//                 }
//                 canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
//                 LogsHandler(logs, figures, canvases["main"].getContext('2d'))
//                 break
//             } else {
//                 continue
//             }
//         }
//     }
// }

// export default UndoMessagesHandler


// new one


import LogsHandler from "./LogsHandler"

const UndoMessagesHandler = (actions, figures, logs, canvases) => {
    if (actions.current === -1) {
        // pass (bottom edge)
    } else {
        let action = actions.data[actions.current]
        let actionFigure = figures[action[0]]
        let versionOfActionFigure = action[1]
        if (versionOfActionFigure === 0) {
            for (let j of Object.keys(actionFigure.versions[0].logs)) {
                logs[j] = null
            }
            actionFigure.status = "undo"
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            actions.current = actions.current - 1
        } else {
            for (let j of Object.keys(actionFigure.versions[versionOfActionFigure].logs)) {
                logs[j] = null
            }
            for (let j of Object.keys(actionFigure.versions[versionOfActionFigure - 1].logs)) {
                logs[j] = actionFigure.versions[versionOfActionFigure - 1].logs[j]
            }
            actionFigure.version = actionFigure.version - 1
            actions.current = actions.current - 1
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            console.log(actionFigure)
        }
    }
}

export default UndoMessagesHandler