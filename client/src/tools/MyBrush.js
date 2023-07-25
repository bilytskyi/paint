import MyTool from "./MyTool"

export default class MyBrush extends MyTool {
    constructor(color, stroke, width, id, canvas, socket, user) {
        super(color, stroke, width, id, canvas, socket, user)
        this.ctx = this.canvas.getContext('2d')
        console.log(this.user)
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
        this.coordinates = []
        this.x = Math.round(e.pageX - this.canvas.offsetLeft)
        this.y = Math.round(e.pageY - this.canvas.offsetTop)
        this.coordinates.push([this.x, this.y])
        this.is_drawing = true
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.stroke
        this.ctx.lineWidth = this.width
        this.ctx.lineCap = "round"
        this.ctx.lineJoin = "round"
        this.ctx.moveTo(this.x, this.y)
        this.socket.send(JSON.stringify({
            method: "users",
            id: this.id,
            user: this.user,
            state: 'start'
        }))

        e.preventDefault()
    }

    move(e) {
        this.x = Math.round(e.pageX - this.canvas.offsetLeft)
        this.y = Math.round(e.pageY - this.canvas.offsetTop)
        if (this.is_drawing) {
            this.coordinates.push([this.x, this.y])
            this.ctx.lineTo(this.x, this.y)
            this.ctx.stroke()
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
            this.ctx.closePath()
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {
                    name: "brush",
                    method: "end",
                    xy: this.coordinates,
                    st: this.stroke,
                    wd: this.width,
                    user: this.user
                }
            }))

            this.socket.send(JSON.stringify({
                method: "users",
                id: this.id,
                user: this.user,
                state: 'end'
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
        ctx.stroke()
        ctx.closePath()
    }

    static draw(ctx, xy, st, wd) {
        ctx.beginPath()
        ctx.moveTo(xy[0][0], xy[0][1])
        xy.forEach(el => {
            ctx.lineTo(el[0], el[1])
        })
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
        ctx.closePath()
    }

}