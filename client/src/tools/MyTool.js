export default class MyTool {
    constructor(settings, id, user, websocket, userid) {
        this.color = settings.color
        this.stroke = settings.stroke
        this.width = settings.width
        this.id = id
        this.canvas = document.getElementById("canvas")
        this.socket = websocket
        this.user = user
        this.userid = userid
        this.destroy()       
    }

    destroy() {
        this.canvas.onpointermove = null
        this.canvas.onpointerdown = null
        this.canvas.onpointerup = null
        this.canvas.onpointerout = null
    }
}