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
        this.x = (e.pageX - this.canvas.offsetLeft).toFixed(1)
        this.y = (e.pageY - this.canvas.offsetTop).toFixed(1)
        this.is_drawing = true
        localStorage.setItem("rectSaved", this.canvas.toDataURL())
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                name: "rect",
                method: "start",
                userid: this.userid,
                cl: this.color,
                st: this.stroke,
                wd: this.width
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
                        name: "rect",
                        method: "move",
                        x: this.x,
                        y: this.y,
                        w: this.x2 - this.x,
                        h: this.y2 - this.y,
                        userid: this.userid
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
                    userid: this.userid
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
        const img = new Image()
        img.src = localStorage.getItem("rectSaved")
        img.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.beginPath()
            ctx.rect(x, y, w, h)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
        }
    }

    static end(ctx) {
        ctx.closePath()
    }

}