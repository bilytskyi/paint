import MyTool from "./MyTool"

export default class MyLine extends MyTool {
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
            this.draw(this.x2, this.y2)
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
                    name: "line",
                    x: this.x,
                    y: this.y,
                    x2: this.x2,
                    y2: this.y2,
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

    draw(x, y) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.x, this.y)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
            this.ctx.closePath()
        }
    }

    static draw(ctx, x, y, x2, y2, st, wd) {
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }
}