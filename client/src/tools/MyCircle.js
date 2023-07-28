import MyTool from "./MyTool"

export default class MyCircle extends MyTool {
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
        this.x = e.pageX - this.canvas.offsetLeft
        this.y = e.pageY - this.canvas.offsetTop
        this.is_drawing = true
        this.ctx.fillStyle = this.color
        this.ctx.strokeStyle = this.stroke
        this.ctx.lineWidth = this.width
        this.ctx.lineCap = "butt"
        this.ctx.lineJoin = "miter"
        this.saved = this.canvas.toDataURL()
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
            this.x2 = e.pageX - this.canvas.offsetLeft
            this.y2 = e.pageY - this.canvas.offsetTop
            this.w = this.x2 - this.x
            this.h = this.y2 - this.y
            this.r = Math.sqrt(this.w**2 + this.h**2)
            this.draw(this.x, this.y, this.r)
        }
        e.preventDefault()
    }

    end(e) {
        if (this.is_drawing) {
            this.is_drawing = false
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    name: "circle",
                    x: this.x,
                    y: this.y,
                    r: this.r,
                    cl: this.color,
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

    draw(x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.closePath()
        }
    }

    static draw(ctx, x, y, r, cl, st, wd) {
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}