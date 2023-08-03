import MyTool from "./MyTool"

export default class MyBrush extends MyTool {
    constructor(color, stroke, width, id, canvas, socket, user, userid) {
        super(color, stroke, width, id, canvas, socket, user, userid)
        this.listen()
    }

    listen() {
        this.canvas.onpointermove = this.move.bind(this)
        this.canvas.onpointerdown = this.start.bind(this)
        this.canvas.onpointerup = this.end.bind(this)
        this.canvas.onpointerout = this.end.bind(this)
    }
    
    start(e) {
        this.x = (e.pageX - this.canvas.offsetLeft).toFixed(1)
        this.y = (e.pageY - this.canvas.offsetTop).toFixed(1)
        this.is_drawing = true
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "brush",
                method: "start",
                x: this.x,
                y: this.y,
                st: this.stroke,
                wd: this.width,
                userid: this.userid
            }
        }))
        e.preventDefault()
    }

    move(e) {
        if (this.is_drawing) {
        const newX = (e.pageX - this.canvas.offsetLeft).toFixed(1)
        const newY = (e.pageY - this.canvas.offsetTop).toFixed(1)
        const distance = Math.sqrt((newX - this.x) ** 2 + (newY - this.y) ** 2)
        if (distance > 5) { 
            this.x = newX
            this.y = newY
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    name: "brush",
                    method: "move",
                    x: this.x,
                    y: this.y,
                    userid: this.userid
                }
            }))
        }}
        e.preventDefault()
    }

    end(e) {
        if (this.is_drawing) {
            this.is_drawing = false
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    name: "brush",
                    method: "end",
                    userid: this.userid
                }
            }))
        }
        e.preventDefault()
    }

    static start(ctx, x, y, st, wd) {
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(x, y)
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    static move(ctx, x, y) {
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    static end(ctx) {
        ctx.closePath()
    }
}