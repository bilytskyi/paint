export default class Tool {
    constructor(settings, socket, id) {
        this.color = settings.color
        this.stroke = settings.stroke
        this.width = settings.width
        this.id = id
        this.canvas = document.getElementById("canvas")
        this.socket = socket
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