import MyTool from "./MyTool"

export default class MyRect extends MyTool {
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
        this.x = (e.offsetX - this.canvas.offsetLeft).toFixed(1)
        this.y = (e.offsetY - this.canvas.offsetTop).toFixed(1)
        this.w = 0
        this.h = 0
        this.is_drawing = true
        this.figureid = `${(+new Date()).toString(16)}`
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "rect",
                method: "start",
                userid: this.userid,
                cl: this.color,
                st: this.stroke,
                wd: this.width,
                figureid: this.figureid,
            }
        }))
        e.preventDefault()
    }

    move(e) {
        if (this.is_drawing) {
            const newX = (e.offsetX - this.canvas.offsetLeft).toFixed(1)
            const newY = (e.offsetY - this.canvas.offsetTop).toFixed(1)
            const distance = Math.sqrt((newX - this.x) ** 2 + (newY - this.y) ** 2)
            if (distance > 5) { 
                this.x2 = newX
                this.y2 = newY
                this.w = this.x2 - this.x
                this.h = this.y2 - this.y
                this.socket.send(JSON.stringify({
                    method: "draw",
                    id: this.id,
                    tool: {  
                        name: "rect",
                        method: "move",
                        x: this.x,
                        y: this.y,
                        w: this.w,
                        h: this.h,
                        userid: this.userid,
                        figureid: this.figureid
                    }
                }))
        }
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
                    method: "end",
                    userid: this.userid,
                    figureid: this.figureid,
                    settings: {
                        color: this.color,
                        stroke: this.stroke,
                        width: this.width,
                        data: [this.x, this.y, this.w, this.h]
                    }
                    
                }
            }))
        }
        e.preventDefault()
    }

    static start(ctx, st, cl, wd) {
        ctx.beginPath()
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
    }

    static move(ctx, x, y, w, h) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

    static end(ctx) {
        ctx.closePath()
    }

    static draw(ctx, x, y, w, h, st, wd, cl) {
        ctx.beginPath()
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

    static draggingAnimation(ctx, x, y, w, h, st, wd, cl) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

}