import MyTool from "./MyTool"

export default class MyLine extends MyTool {
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
        this.figureid = `${(+new Date()).toString(16)}`
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "line",
                method: "start",
                userid: this.userid,
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
                this.socket.send(JSON.stringify({
                    method: "draw",
                    id: this.id,
                    tool: {  
                        name: "line",
                        method: "move",
                        x: this.x,
                        y: this.y,
                        x2: this.x2,
                        y2: this.y2,
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
            this.x2 = (e.pageX - this.canvas.offsetLeft).toFixed(1)
            this.y2 = (e.pageY - this.canvas.offsetTop).toFixed(1)
            this.is_drawing = false
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    name: "line",
                    method: "end",
                    userid: this.userid,
                    settings: {
                        stroke: this.stroke,
                        width: this.width,
                        data: [this.x, this.y, this.x2, this.y2]
                    },
                    figureid: this.figureid
                    
                }
            }))
        }
        e.preventDefault()
    }

    static start(ctx, st, wd) {
        console.log('start')
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
    }

    static move(ctx, x, y, x2, y2) {
        console.log('move')
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }

    static end(ctx) {
        console.log('end')
        // ctx.closePath()
    }

    static draw(ctx, x, y, x2, y2, st, wd) {
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }

    static draggingAnimation(ctx, x, y, x2, y2, st, wd) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath()
        ctx.strokeStyle = st
        ctx.lineWidth = wd
        ctx.lineCap = "butt"
        ctx.lineJoin = "miter"
        ctx.moveTo(x, y)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }
}