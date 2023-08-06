const OffscreenCanvasesHandler = (canvases, users) => {
    const canvasesKeys = Object.keys(canvases)
    const usersKeys = Object.keys(users)
    console.log(canvases)
    console.log(usersKeys)

    for (let userID of usersKeys) {
        if (!canvases[userID]) {
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext("2d")
            const obj = {
                canvas: canvas,
                ctx: ctx
            }
            canvases[userID] = obj
        }
    }
}

export default OffscreenCanvasesHandler