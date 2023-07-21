import MyTool from "./MyTool"

export default class MyLine extends MyTool {
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
        this.saved = this.canvas.toDataURL();
        this.socket.send(JSON.stringify({
            method: "draw2",
            id: this.id,
            tool: {
                name: "line",
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
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {  
                    name: "line",
                    method: "move",
                    x: this.x,
                    y: this.y,
                    x2: this.x2,
                    y2: this.y2,
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
                    name: "line",
                    method: "end",
                }
            }))
        }
        e.preventDefault()
    }

    static start(saved) {
        localStorage.setItem("lineSaved", saved);
    }

    static move(ctx, x, y, x2, y2, st, wd) {
        MyLine.draw(ctx, x, y, x2, y2, st, wd)
    }

    static end(ctx) {
        ctx.closePath()
    }

    static draw(ctx, x, y, x2, y2, st, wd) {
        console.log(x, y, x2, y2)
        const img = new Image();
        img.src = localStorage.getItem("lineSaved")
        img.onload = () => {
            ctx.strokeStyle = st
            ctx.lineWidth = wd
            ctx.lineCap = "butt"
            ctx.lineJoin = "miter"
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
      }
}