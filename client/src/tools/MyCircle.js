import MyTool from "./MyTool"

export default class MyCircle extends MyTool {
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
        this.r = 0
        this.is_drawing = true
        this.figureid = `${(+new Date()).toString(16)}`
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "circle",
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
            const newX = (e.pageX - this.canvas.offsetLeft).toFixed(1)
            const newY = (e.pageY - this.canvas.offsetTop).toFixed(1)
            const distance = Math.sqrt((newX - this.x) ** 2 + (newY - this.y) ** 2)
            if (distance > 5) { 
                this.x2 = newX
                this.y2 = newY
                this.w = this.x2 - this.x
                this.h = this.y2 - this.y
                this.r = (Math.sqrt(this.w**2 + this.h**2)).toFixed(1)
                this.socket.send(JSON.stringify({
                    method: "draw",
                    id: this.id,
                    tool: {  
                        name: "circle",
                        method: "move",
                        x: this.x,
                        y: this.y,
                        r: this.r,
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
                    name: "circle",
                    method: "end",
                    userid: this.userid,
                    cl: this.color,
                    st: this.stroke,
                    wd: this.width,
                    x: this.x,
                    y: this.y,
                    r: this.r,
                    figureid: this.figureid
                    
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

    static move(ctx, x, y, r) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }

    static end(ctx) {
        ctx.closePath()
    }

    static draw(ctx, x, y, r, st, wd, cl) {
        ctx.beginPath()
        ctx.fillStyle = cl
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}