import MyTool from "./MyTool"

export default class MyEraser extends MyTool {
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
        this.is_drawing = true
        this.curr = [this.x, this.y]
        this.prev = null
        this.figureid = `${(+new Date()).toString(16)}`
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "eraser",
                method: "start",
                curr: this.curr,
                prev: this.prev,
                st: "#ffffff",
                wd: this.width,
                userid: this.userid,
                figureid: this.figureid
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
            this.prev = [this.x, this.y]
            this.x = newX
            this.y = newY
            this.curr = [this.x, this.y]
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    name: "eraser",
                    method: "move",
                    curr: this.curr,
                    prev: this.prev,
                    userid: this.userid,
                    figureid: this.figureid
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
                    name: "eraser",
                    method: "end",
                    userid: this.userid,
                    wd: this.width,
                    figureid: this.figureid

                }
            }))
        }
        e.preventDefault()
    }

    static start(ctx, x, y, wd) {
        ctx.beginPath()
        ctx.strokeStyle = "#ffffff"
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

    static draw(ctx, xy, st, wd) {
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(xy[0][0], xy[0][1])
        xy.forEach(coor => {
            ctx.lineTo(coor[0], coor[1])
        })
        ctx.stroke()
        ctx.closePath()
    }

    static draggingAnimation(ctx, xy, st, wd) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(xy[0][0], xy[0][1])
        xy.forEach(coor => {
            ctx.lineTo(coor[0], coor[1])
        })
        ctx.stroke()
        ctx.closePath()
    }
}