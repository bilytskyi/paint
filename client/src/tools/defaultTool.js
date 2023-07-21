import MyTool from "./MyTool"

export default class XXX extends MyTool {
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
        this.socket.send(JSON.stringify({
            method: "draw2",
            id: this.id,
            tool: {
                name: "",
                method: "start",
            }
        }))

        e.preventDefault()
    }

    move(e) {
        if (e.type === 'touchmove') {
            this.x = e.touches[0].pageX - this.canvas.offsetLeft
            this.y = e.touches[0].pageY - this.canvas.offsetTop
        } else {
            this.x = e.pageX - this.canvas.offsetLeft
            this.y = e.pageY - this.canvas.offsetTop
        }
        if (this.is_drawing) {
            this.socket.send(JSON.stringify({
                method: "draw2",
                id: this.id,
                tool: {  
                    name: "",
                    method: "move",
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
                    name: "",
                    method: "end",
                }
            }))
        }
        e.preventDefault()
    }

}