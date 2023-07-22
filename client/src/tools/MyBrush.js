import MyTool from "./MyTool"

export default class MyBrush extends MyTool {
    constructor(color, stroke, width, id, canvas, socket) {
        super(color, stroke, width, id, canvas, socket)
        this.listen()
    }

    listen() {
        this.canvas.onpointermove = this.move.bind(this)
        this.canvas.onpointerdown = this.start.bind(this)
        this.canvas.onpointerup = this.end.bind(this)
        this.canvas.onmousemove = this.move.bind(this)
        this.canvas.onmousedown = this.start.bind(this)
        this.canvas.onmouseup = this.end.bind(this)
        this.canvas.onmouseout = this.end.bind(this)
    }
    
    start(e) {
        this.x = Math.round(e.pageX - this.canvas.offsetLeft)
        this.y = Math.round(e.pageY - this.canvas.offsetTop)
        this.is_drawing = true
        this.socket.send(JSON.stringify({
            method: "draw2",
            id: this.id,
            tool: {
                name: "brush",
                method: "start",
                x: this.x,
                y: this.y,
            }
        }))

        e.preventDefault()
    }

    move(e) {
        this.x = Math.round(e.pageX - this.canvas.offsetLeft)
        this.y = Math.round(e.pageY - this.canvas.offsetTop)
        if (this.is_drawing) {
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {
                    name: "brush",
                    method: "move",
                    x: this.x,
                    y: this.y,
                    st: this.stroke,
                    wd: this.width
                }
            }))
        }
        e.preventDefault()
    }

    end(e) {
        if (this.is_drawing) {
            this.is_drawing = false
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {
                    name: "brush",
                    method: "end"
                }
            }))
        }
        e.preventDefault()
    }

    static start(ctx, x, y) {
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    static move(ctx, x, y, st, wd) {
        ctx.lineTo(x, y)
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
    }

    static end(ctx) {
        ctx.closePath()
    }

}