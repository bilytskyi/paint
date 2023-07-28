export default class MyMouse {
    constructor() {
        this.canvas = document.getElementById("canvas")
        this.destroy()       
    }

    destroy() {
        this.canvas.onpointermove = null
        this.canvas.onpointerdown = null
        this.canvas.onpointerup = null
        this.canvas.onpointerout = null
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
        this.canvas.onmouseout = null
    }
}