import MyBrush from "../tools/MyBrush"

const createCanvas = (canvases, userId) => {
    const canvas = document.createElement("canvas")
    canvas.width = 1920
    canvas.height = 1080
    canvases[userId] = canvas
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
                    width: data.wd
                },
                logs: {},
                edges: [],
                xy: [],
                user: userId
            })
            break
        case "rect":
            figure.versions.push({
                settings: {
                    stroke: data.st,
                    width: data.wd,
                    color: data.cl,
                    data: [data.x, data.y, data.w, data.h]
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "circle":
            figure.versions.push({
                settings: {
                    stroke: data.st,
                    width: data.wd,
                    color: data.cl,
                    data: [data.x, data.y, data.r]
                },
                logs: {},
                edges: [],
                user: userId
            })
            break
        case "line":
            figure.versions.push({
                settings: {
                    stroke: data.st,
                    width: data.wd,
                    color: data.cl,
                    data: [data.x, data.y, data.x2, data.y2]
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
                    width: data.wd
                },
                logs: {},
                edges: [],
                xy: [],
                user: userId
            })
            break
    }
    return figure
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
                color: data.cl,
                stroke: data.st,
                width: data.wd,
                data: [data.x, data.y, data.w, data.h]
            }
            break
        case "circle":
            log.settings = {
                color: data.cl,
                stroke: data.st,
                width: data.wd,
                data: [data.x, data.y, data.r]
            }
            break
        case "line":
            log.settings = {
                color: data.cl,
                stroke: data.st,
                width: data.wd,
                data: [data.x, data.y, data.x2, data.y2]
            }
            break
        case "eraser":
            log.curr = data.curr
            log.prev = data.prev
            break
        case "moved_brush":
            log.settings = {
                stroke: data.st,
                width: data.wd,
                xy: data.xy
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
            for (let dot of figure.xy) {
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
            for (let dot of figure.xy) {
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
            data.y < figures[key].versions[v].edges[3]
        ) {
            createCanvas(canvases, userId)
            selectedFigure.id = key
            console.log(key)
            console.log(figuresKeys)
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
    figure.new_data = {
        st: figure.versions[version].settings.stroke,
        wd: figure.versions[version].settings.width,
        xy: []
    }
    switch (figure.type) {
        case "brush":
            for (let dot of figure.versions[version].xy) {
                const dx = parseInt(data.dx)
                const dy = parseInt(data.dy)
                const x = parseInt(dot[0])
                const y = parseInt(dot[1])
                newData.push([x + dx, y + dy])
            }
            MyBrush.draggingAnimation(
                ctx,
                newData,
                figure.versions[version].settings.stroke,
                figure.versions[version].settings.width
            )
            figure.new_data.xy = newData
            break
        case "rect":
            1
            break
        case "circle":
            1
            break
        case "line":
            1
            break
        case "eraser":
            1
            break
    }

}

export { createCanvas, createFigure, createLog, createEdges, selectFigure, animationOfDragging }