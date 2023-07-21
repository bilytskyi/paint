import MyTool from "./MyTool"

export default class MyCircle extends MyTool {
    constructor(color, stroke, width, id, canvas, socket) {
        super(color, stroke, width, id, canvas, socket)
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
        if (e.type === 'touchstart') {
            this.x = e.touches[0].pageX - this.canvas.offsetLeft
            this.y = e.touches[0].pageY - this.canvas.offsetTop
        } else {
            this.x = e.pageX - this.canvas.offsetLeft
            this.y = e.pageY - this.canvas.offsetTop
        }
        this.is_drawing = true
        this.saved = this.canvas.toDataURL()
        this.socket.send(JSON.stringify({
            method: "draw2",
            id: this.id,
            tool: {
                name: "circle",
                method: "start",
                saved: this.saved
            }
        }))

        e.preventDefault()
    }

    move(e) {
        if (e.type === 'touchmove') {
            this.x2 = e.touches[0].pageX - this.canvas.offsetLeft
            this.y2 = e.touches[0].pageY - this.canvas.offsetTop
        } else {
            this.x2 = e.pageX - this.canvas.offsetLeft
            this.y2 = e.pageY - this.canvas.offsetTop
        }
        if (this.is_drawing) {
            this.r = Math.sqrt((this.x2 - this.x)**2 + (this.y2 - this.y)**2)
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {  
                    name: "circle",
                    method: "move",
                    x: this.x,
                    y: this.y,
                    r: this.r,
                    cl: this.color,
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
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {
                    name: "circle",
                    method: "end",
                }
            }))
        }
        e.preventDefault()
    }

    static start(saved) {
        localStorage.setItem("circleSaved", saved);
    }

    static move(ctx, x, y, r, cl, st, wd) {
        MyCircle.draw(ctx, x, y, r, cl, st, wd)
    }

    static end(ctx) {
        ctx.closePath()
    }

    static draw(ctx, x, y, r, cl, st, wd) {
        console.log(x, y, r, cl, st, wd)
        const img = new Image()
        img.src = localStorage.getItem("circleSaved")
        img.onload = () => {
            ctx.fillStyle = cl
            ctx.strokeStyle = st
            ctx.lineWidth = wd
            ctx.lineCap = "butt"
            ctx.lineJoin = "miter"
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.beginPath()
            ctx.arc(x, y, r, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke()
        }
    }
}