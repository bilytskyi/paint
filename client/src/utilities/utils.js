import MyBrush from "../tools/MyBrush"
import MyCircle from "../tools/MyCircle"
import MyLine from "../tools/MyLine"
import MyRect from "../tools/MyRect"
import MyEraser from "../tools/MyEraser"

const createCanvas = (canvases, userId) => {
    if (!canvases[userId]) {
        const canvas = document.createElement("canvas")
        canvas.width = 1920
        canvas.height = 1080
        canvases[userId] = canvas
    }
}

const createFigure = (type, userId, data) => {
    const figure = {
        type: type,
        user: userId,
        status: "good",
        version: 0,
        versions: []
    }
    switch (type) {
        case "brush":
            figure.versions.push({
                settings: {
                    stroke: data.st,
                    width: data.wd,
                    data: []
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "rect":
            figure.versions.push({
                settings: {
                    color: data.settings.color,
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "circle":
            figure.versions.push({
                settings: {
                    color: data.settings.color,
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "line":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "eraser":
            figure.versions.push({
                settings: {
                    stroke: data.st,
                    width: data.wd,
                    data: []
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
    }
    return figure
}

const updateFigure = (type, userId, data, figure) => {
    switch (type) {
        case "brush":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "rect":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    color: data.settings.color,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "circle":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    color: data.settings.color,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "line":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "eraser":
            figure.versions.push({
                settings: {
                    stroke: data.settings.stroke,
                    width: data.settings.width,
                    data: data.settings.data
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
    }
}

const createLog = (type, userId, figureId, data) => {
    const log = {
        timestamp: Date.now(),
        user: userId,
        figure: figureId
    }
    switch (type) {
        case "brush":
            log.curr = data.curr
            log.prev = data.prev
            break
        case "rect":
            log.settings = {
                color: data.settings.color,
                stroke: data.settings.stroke,
                width: data.settings.width,
                data: data.settings.data
            }
            break
        case "circle":
            log.settings = {
                color: data.settings.color,
                stroke: data.settings.stroke,
                width: data.settings.width,
                data: data.settings.data
            }
            break
        case "line":
            log.settings = {
                stroke: data.settings.stroke,
                width: data.settings.width,
                data: data.settings.data
            }
            break
        case "eraser":
            log.curr = data.curr
            log.prev = data.prev
            break
        case "moved_brush_eraser":
            log.settings = {
                stroke: data.settings.stroke,
                width: data.settings.width,
                data: data.settings.data
            }
            break
    }
    return log
}

const createEdges = (figureId, figures) => {
    const version = figures[figureId].version
    const figure = figures[figureId].versions[version]
    const type = figures[figureId].type

    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    switch (type) {
        case "brush":
            for (let dot of figure.settings.data) {
                let x = parseInt(dot[0])
                let y = parseInt(dot[1])
        
                if (x > xMax) {
                    xMax = x
                }
                if (x < xMin) {
                    xMin = x
                }
                if (y > yMax) {
                    yMax = y
                }
                if (y < yMin) {
                    yMin = y
                }
            }
            figure.edges.push(xMin - figure.settings.width / 2 - 3)
            figure.edges.push(xMax + figure.settings.width / 2 + 3)
            figure.edges.push(yMin - figure.settings.width / 2 - 3)
            figure.edges.push(yMax + figure.settings.width / 2 + 3)
            break
        case "rect":
            if (figure.settings.data[2] >= 0) {
                xMin = parseInt(figure.settings.data[0])
                xMax = parseInt(figure.settings.data[2]) + parseInt(figure.settings.data[0])
            } else {
                xMin = parseInt(figure.settings.data[2]) + parseInt(figure.settings.data[0])
                xMax = parseInt(figure.settings.data[0])
            }
            if (figure.settings.data[3] >= 0) {
                yMin = parseInt(figure.settings.data[1])
                yMax = parseInt(figure.settings.data[3]) + parseInt(figure.settings.data[1])
            } else {
                yMin = parseInt(figure.settings.data[3]) + parseInt(figure.settings.data[1])
                yMax = parseInt(figure.settings.data[1])
            }
            figure.edges.push(xMin - figure.settings.width - 3)
            figure.edges.push(xMax + figure.settings.width + 3)
            figure.edges.push(yMin - figure.settings.width - 3)
            figure.edges.push(yMax + figure.settings.width + 3)
            break
        case "circle":
            xMin = parseInt(figure.settings.data[0]) - parseInt(figure.settings.data[2])
            xMax = parseInt(figure.settings.data[0]) + parseInt(figure.settings.data[2])
            yMin = parseInt(figure.settings.data[1]) - parseInt(figure.settings.data[2])
            yMax = parseInt(figure.settings.data[1]) + parseInt(figure.settings.data[2])
            figure.edges.push(xMin - figure.settings.width - 3)
            figure.edges.push(xMax + figure.settings.width + 3)
            figure.edges.push(yMin - figure.settings.width - 3)
            figure.edges.push(yMax + figure.settings.width + 3)
            break
        case "line":
            if (parseInt(figure.settings.data[0]) > parseInt(figure.settings.data[2])) {
                xMin = parseInt(figure.settings.data[2])
                xMax = parseInt(figure.settings.data[0])
            } else {
                xMin = parseInt(figure.settings.data[0])
                xMax = parseInt(figure.settings.data[2])
            }
            if (parseInt(figure.settings.data[1]) > parseInt(figure.settings.data[3])) {
                yMin = parseInt(figure.settings.data[3])
                yMax = parseInt(figure.settings.data[1])
            } else {
                yMin = parseInt(figure.settings.data[1])
                yMax = parseInt(figure.settings.data[3])
            }
            figure.edges.push(xMin - figure.settings.width - 3)
            figure.edges.push(xMax + figure.settings.width + 3)
            figure.edges.push(yMin - figure.settings.width - 3)
            figure.edges.push(yMax + figure.settings.width + 3)
            break
        case "eraser":
            for (let dot of figure.settings.data) {
                let x = parseInt(dot[0])
                let y = parseInt(dot[1])
        
                if (x > xMax) {
                    xMax = x
                }
                if (x < xMin) {
                    xMin = x
                }
                if (y > yMax) {
                    yMax = y
                }
                if (y < yMin) {
                    yMin = y
                }
            }
            figure.edges.push(xMin - figure.settings.width / 2 - 3)
            figure.edges.push(xMax + figure.settings.width / 2 + 3)
            figure.edges.push(yMin - figure.settings.width / 2 - 3)
            figure.edges.push(yMax + figure.settings.width / 2 + 3)
            break
    }
}

const selectFigure = (userId, figures, data, selectedFigure, canvases) => {
    // reverse array because you need the last figure on layer
    const figuresKeys = Object.keys(figures).toReversed()
    for (let key of figuresKeys) {
        const v = figures[key].version
        if (
            data.x > figures[key].versions[v].edges[0] &&
            data.x < figures[key].versions[v].edges[1] &&
            data.y > figures[key].versions[v].edges[2] &&
            data.y < figures[key].versions[v].edges[3] &&
            figures[key].status !== "undo"
        ) {
            createCanvas(canvases, userId)
            selectedFigure.id = key
            console.log(key)
            figures[key].is_redraw = false
            break
        }
    }
}

const animationOfDragging = (userId, canvases, selectedFigure, figures, data) => {
    const ctx = canvases[userId].getContext('2d')
    const figure = figures[selectedFigure.id]
    const version = figure.version
    const newData = []
    let x, y, w, h, r, x2, y2, st, cl, wd
    figure.new_data = {
        settings: {
            stroke: figure.versions[version].settings.stroke,
            width: figure.versions[version].settings.width
        }
    }
    switch (figure.type) {
        case "brush":
            for (let dot of figure.versions[version].settings.data) {
                x = parseInt(dot[0])
                y = parseInt(dot[1])
                newData.push([x + parseInt(data.dx), y + parseInt(data.dy)])
            }
            MyBrush.draggingAnimation(
                ctx,
                newData,
                figure.versions[version].settings.stroke,
                figure.versions[version].settings.width
            )
            figure.new_data.settings.data = newData
            break
        case "rect":
            w = figure.versions[version].settings.data[2]
            h = figure.versions[version].settings.data[3]
            x = parseInt(figure.versions[version].settings.data[0]) + parseInt(data.dx)
            y = parseInt(figure.versions[version].settings.data[1]) + parseInt(data.dy)
            st = figure.versions[version].settings.stroke
            cl = figure.versions[version].settings.color
            wd = figure.versions[version].settings.width
            MyRect.draggingAnimation(ctx, x, y, w, h, st, wd, cl)
            figure.new_data.settings.data = [x, y, w, h]
            figure.new_data.settings.color = cl
            break
        case "circle":
            r = figure.versions[version].settings.data[2]
            x = parseInt(figure.versions[version].settings.data[0]) + parseInt(data.dx)
            y = parseInt(figure.versions[version].settings.data[1]) + parseInt(data.dy)
            st = figure.versions[version].settings.stroke
            cl = figure.versions[version].settings.color
            wd = figure.versions[version].settings.width
            MyCircle.draggingAnimation(ctx, x, y, r, st, wd, cl)
            figure.new_data.settings.data = [x, y, r]
            figure.new_data.settings.color = cl
            break
        case "line":
            x = parseInt(figure.versions[version].settings.data[0]) + parseInt(data.dx)
            y = parseInt(figure.versions[version].settings.data[1]) + parseInt(data.dy)
            x2 = parseInt(figure.versions[version].settings.data[2]) + parseInt(data.dx)
            y2 = parseInt(figure.versions[version].settings.data[3]) + parseInt(data.dy)
            st = figure.versions[version].settings.stroke
            wd = figure.versions[version].settings.width
            MyLine.draggingAnimation(ctx, x, y, x2, y2, st, wd)
            figure.new_data.settings.data = [x, y, x2, y2]
            break
        case "eraser":
            for (let dot of figure.versions[version].settings.data) {
                x = parseInt(dot[0])
                y = parseInt(dot[1])
                newData.push([x + parseInt(data.dx), y + parseInt(data.dy)])
            }
            MyBrush.draggingAnimation(
                ctx,
                newData,
                figure.versions[version].settings.stroke,
                figure.versions[version].settings.width
            )
            figure.new_data.settings.data = newData
            break
    }

}

export { createCanvas, createFigure, createLog, createEdges, selectFigure, animationOfDragging, updateFigure }