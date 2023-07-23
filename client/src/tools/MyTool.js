export default class Tool {
    constructor(settings, id) {
        this.color = settings.color
        this.stroke = settings.stroke
        this.width = settings.width
        this.id = id
        this.canvas = document.getElementById("canvas")
        this.socket = new WebSocket('ws://16.170.240.78:5000/')
        // this.socket = new WebSocket('ws://localhost:5000/')
        this.serverUrl = process.env.REACT_APP_SERVER_URL
        console.log(this.serverUrl)
        this.destroy()       
    }

    destroy() {
        this.canvas.onpointermove = null
        this.canvas.onpointerdown = null
        this.canvas.onpointerup = null
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
        this.canvas.onmouseout = null
    }
}