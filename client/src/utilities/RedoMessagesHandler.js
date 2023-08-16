// import LogsHandler from "./LogsHandler"

// const RedoMessagesHandler = (userId, figures, logs, canvases) => {
//     const figuresKeys = Object.keys(figures)

//     for (let i = 0; i < figuresKeys.length; i++) {
//         const figure = figures[figuresKeys[i]]
//         let version = figure.version
//         let user = figure.user
//         const status = figure.status
//         let versionLimitBoolean = version < (figure.versions.length - 1)
//         if (version === 0) {
//             if (user === userId) {
//                 if (status === "undo") {
//                     for (let j of Object.keys(figure.versions[version].logs)) {
//                         logs[j] = figure.versions[version].logs[j]
//                     }
//                     figure.status = "good"
//                     canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
//                     LogsHandler(logs, figures, canvases["main"].getContext('2d'))
//                     break
//                 }
//                 else if (status === "good" && figure.versions.length > 1) {
//                     for (let j of Object.keys(figure.versions[figure.version].logs)) {
//                         logs[j] = null
//                     }
//                     figure.status = "changed"
//                     figure.version = 1
//                     for (let j of Object.keys(figure.versions[figure.version].logs)) {
//                         logs[j] = figure.versions[figure.version].logs[j]
//                     }
//                     canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
//                     LogsHandler(logs, figures, canvases["main"].getContext('2d'))
//                     break
//                 }
//             } else {
//                 continue
//             }
//         } else {
//             if (user === userId && versionLimitBoolean) {
//                 console.log("hello")
//                 for (let j of Object.keys(figure.versions[version].logs)) {
//                     logs[j] = null
//                 }
//                 figure.version = version + 1
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

// export default RedoMessagesHandler



import LogsHandler from "./LogsHandler"

const RedoMessagesHandler = (actions, figures, logs, canvases) => {
    if (actions.current === actions.data.length - 1) {
        // pass (top edge)
    } else {

        if (actions.current === -1) {
            let futureAction = actions.data[actions.current + 1]
            let futureActionFigure = figures[futureAction[0]]
            let versionOfFutureActionFigure = futureAction[1]
            for (let j of Object.keys(futureActionFigure.versions[versionOfFutureActionFigure].logs)) {
                logs[j] = futureActionFigure.versions[versionOfFutureActionFigure].logs[j]
            }
            actions.current = actions.current + 1
            futureActionFigure.status = "good"
            canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
            LogsHandler(logs, figures, canvases["main"].getContext('2d'))
        } else {
            let currentAction = actions.data[actions.current]
            let currentActionFigure = figures[currentAction[0]]
            let versionOfCurrentActionFigure = currentAction[1]

            let futureAction = actions.data[actions.current + 1]
            let futureActionFigure = figures[futureAction[0]]
            let versionOfFutureActionFigure = futureAction[1]

            if (currentAction[0] === futureAction[0]) { // if it is the same figure, but diff version
                for (let j of Object.keys(currentActionFigure.versions[versionOfCurrentActionFigure].logs)) {
                    logs[j] = null
                }
                for (let j of Object.keys(futureActionFigure.versions[versionOfFutureActionFigure].logs)) {
                    console.log(futureActionFigure)
                    logs[j] = futureActionFigure.versions[versionOfFutureActionFigure].logs[j]
                }
                futureActionFigure.version = futureActionFigure.version + 1
                actions.current = actions.current + 1
                canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
                LogsHandler(logs, figures, canvases["main"].getContext('2d'))
            } else { // if it is diff figures, just draw version of new one
                if (versionOfFutureActionFigure === 0) {
                    for (let j of Object.keys(futureActionFigure.versions[versionOfFutureActionFigure].logs)) {
                        logs[j] = futureActionFigure.versions[versionOfFutureActionFigure].logs[j]
                    }
                    actions.current = actions.current + 1
                    futureActionFigure.status = "good"
                    canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
                    LogsHandler(logs, figures, canvases["main"].getContext('2d'))
                } else {
                    for (let j of Object.keys(futureActionFigure.versions[versionOfFutureActionFigure - 1].logs)) {
                        logs[j] = null
                    }
                    for (let j of Object.keys(futureActionFigure.versions[versionOfFutureActionFigure].logs)) {
                        logs[j] = futureActionFigure.versions[versionOfFutureActionFigure].logs[j]
                    }
                    futureActionFigure.version = futureActionFigure.version + 1
                    actions.current = actions.current + 1
                    canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
                    LogsHandler(logs, figures, canvases["main"].getContext('2d'))
                }
            }
        }
    }
}

export default RedoMessagesHandler