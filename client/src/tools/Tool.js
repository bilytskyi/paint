export default class Tool {
    constructor(toolSetting, id) {
        this.canvas = document.getElementById("canvas");
        this.socket = new WebSocket('ws://localhost:5000/')
        this.id = id
        this.ctx = this.canvas.getContext('2d')
        this.toolSetting = toolSetting
        this.ctx.fillStyle = toolSetting.color;
        this.ctx.strokeStyle = toolSetting.stroke;
        this.ctx.lineWidth = toolSetting.width;
        this.destroyEvents()
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }
}