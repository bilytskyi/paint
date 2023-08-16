import LogsHandler from "./LogsHandler"
import { createEdges, createLog, selectFigure, animationOfDragging, updateFigure } from "./utils"

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
                animationOfDragging(userId, canvases, selectedFigure, figures, data)
            }
            break
        case "end":
            if (selectedFigure.id !== null) {
                const figure = figures[selectedFigure.id]
                if (figure.version < figure.versions.length - 1) {
                    figure.version = figure.version + 1
                    figure.versions = figure.versions.slice(0, figure.version)
                    let type = figure.type
                    figure.is_redraw = false
                    updateFigure(type, userId, figure.new_data, figure)
                    if (type === "brush" || type === "eraser") {
                        type = "moved_brush_eraser"
                    }
                    let log = createLog(type, userId, selectedFigure.id, figure.new_data)
                    let j = logs.length
                    figure.versions[figure.version].logs[j] = log
                    logs.push(log)
                    createEdges(selectedFigure.id, figures)
                    delete canvases[userId]
                } else {
                    let type = figure.type
                    figure.is_redraw = false
                    figure.version = figure.version + 1
                    updateFigure(type, userId, figure.new_data, figure)
                    if (type === "brush" || type === "eraser") {
                        type = "moved_brush_eraser"
                    }
                    let log = createLog(type, userId, selectedFigure.id, figure.new_data)
                    let j = logs.length
                    figure.versions[figure.version].logs[j] = log
                    logs.push(log)
                    createEdges(selectedFigure.id, figures)
                    delete canvases[userId]
                }
            }
            break
    }
}

export default DraggingMessagesHandler