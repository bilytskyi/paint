const DrawBrushHandler = (ctx, settings, curr, prev) => {
    const stroke = settings.stroke
    const width = settings.width
    if (prev === null) {
        ctx.beginPath()
        ctx.strokeStyle = stroke
        ctx.lineWidth = width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineTo(curr[0], curr[1])
        ctx.stroke()
        ctx.closePath()
    } else {
        ctx.beginPath()
        ctx.strokeStyle = stroke
        ctx.lineWidth = width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.moveTo(prev[0], prev[1])
        ctx.lineTo(curr[0], curr[1])
        ctx.stroke()
        ctx.closePath()
    }
}

export default DrawBrushHandler