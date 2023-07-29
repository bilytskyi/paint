import MyTool from "./MyTool"

export default class MyRect extends MyTool {
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
        this.x = (e.pageX - this.canvas.offsetLeft).toFixed(1)
        this.y = (e.pageY - this.canvas.offsetTop).toFixed(1)
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
            this.x2 = (e.pageX - this.canvas.offsetLeft).toFixed(1)
            this.y2 = (e.pageY - this.canvas.offsetTop).toFixed(1)
            this.w = this.x2 - this.x
            this.h = this.y2 - this.y
            this.draw(this.x, this.y, this.w, this.h)
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
                    name: "rect",
                    x: this.x,
                    y: this.y,
                    w: this.w,
                    h: this.h,
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

    draw(x, y, w, h) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.closePath()
        }
    }

    static draw(ctx, x, y, w, h, cl, st, wd) {
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}