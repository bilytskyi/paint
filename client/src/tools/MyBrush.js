import MyTool from "./MyTool"

export default class MyBrush extends MyTool {
    constructor(color, stroke, width, id, canvas, socket, user) {
        super(color, stroke, width, id, canvas, socket, user)
        this.ctx = this.canvas.getContext('2d')
        this.listen()
    }

    listen() {
        this.canvas.onpointermove = this.move.bind(this)
        this.canvas.onpointerdown = this.start.bind(this)
        this.canvas.onpointerup = this.end.bind(this)
        this.canvas.onpointerout = this.end.bind(this)
    }
    
    start(e) {
        this.coordinates = []
        this.x = (e.pageX - this.canvas.offsetLeft).toFixed(1)
        this.y = (e.pageY - this.canvas.offsetTop).toFixed(1)
        this.coordinates.push([this.x, this.y])
        this.is_drawing = true
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.stroke
        this.ctx.lineWidth = this.width
        this.ctx.lineCap = "round"
        this.ctx.lineJoin = "round"
        this.ctx.moveTo(this.x, this.y)
        this.ctx.lineTo(this.x, this.y)
        this.ctx.stroke()
        this.ctx.closePath()
        this.socket.send(JSON.stringify({
            method: "users",
            id: this.id,
            user: this.user,
            state: "start"
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
            this.coordinates.push([this.x, this.y])
            this.ctx.lineTo(this.x, this.y)
            this.ctx.stroke()
            this.ctx.closePath()
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
                state: "end"
            }))
        }
        e.preventDefault()
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