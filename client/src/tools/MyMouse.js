import MyTool from "./MyTool"

export default class MyMouse extends MyTool {
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
        this.is_dragging = true
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            tool: {
                method: "start",
                name: "dragging",
                userid: this.userid,
                x: this.x,
                y: this.y
            }
        }))
        e.preventDefault()
    }

    move(e) {
        if (this.is_dragging) {
            this.x2 = (e.pageX - this.canvas.offsetLeft).toFixed(1)
            this.y2 = (e.pageY - this.canvas.offsetTop).toFixed(1)
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    method: "move",
                    name: "dragging",
                    userid: this.userid,
                    dx: this.x2 - this.x,
                    dy: this.y2 - this.y

                }
            }))
        }
        e.preventDefault()
    }

    end(e) {
        if (this.is_dragging) {
            this.is_dragging = false
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                tool: {
                    method: "end",
                    name: "dragging",
                    userid: this.userid,
                    dx: this.x2 - this.x,
                    dy: this.y2 - this.y
                }
            }))
        }
        e.preventDefault()
    }
}