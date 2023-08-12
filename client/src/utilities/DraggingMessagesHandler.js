import LogsHandler from "./LogsHandler"
import { createEdges, createLog, selectFigure, animationOfDragging } from "./utils"

const DraggingMessagesHandler = (userId, figures, data, selectedFigure, canvases, logs) => {
    switch (data.method) {
        case "start":
            selectFigure(userId, figures, data, selectedFigure, canvases)
            break
        case "move":
            if (selectedFigure.id !== null) {
                const figure = figures[selectedFigure.id]
                const version = figure.version
                // nulling logs, change figure status, redraw all without selected figure
                if (!figure.is_redraw) {
                    for (let j of Object.keys(figure.versions[version].logs)) {
                        logs[j] = null
                    }
                    figure.status = "changed"
                    canvases["main"].getContext('2d').clearRect(0, 0, 1920, 1080)
                    LogsHandler(logs, figures, canvases["main"].getContext('2d'))
                    figure.is_redraw = true
                }
                // draggings animations
                console.log(figure.is_redraw)
                animationOfDragging(userId, canvases, selectedFigure, figures, data)
            }
            break
        case "end":
            if (selectedFigure.id !== null) {
                const figure = figures[selectedFigure.id]
                figure.is_redraw = false
                figure.version = figure.version + 1
                figure.versions.push({
                    settings: {
                        stroke: figure.new_data.st,
                        width: figure.new_data.wd
                    },
                    logs: {},
                    edges: [],
                    xy: figure.new_data.xy,
                    user: userId
                })

                let log = createLog("moved_brush", userId, selectedFigure.id, figure.new_data)
                let j = logs.length
                figure.versions[figure.version].logs[j] = log
                logs.push(log)

                createEdges(selectedFigure.id, figures)

                selectedFigure.id = null
                delete canvases[userId]
                console.log(figure.is_redraw)
            }
            break
    }
}

export default DraggingMessagesHandler