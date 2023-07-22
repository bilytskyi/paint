import MyBrush from "../tools/MyBrush"

const drawFromMemory = (data, canvas) => {
    const ctx = canvas.getContext('2d')
    const chunks = data.split(';')
    console.log(chunks)
    // chunks.forEach((chunk, i) => {
    //     setTimeout(() => {
    //         drawHandler(chunk, ctx);
    //     }, i * 50)
    // })

    chunks.forEach((chunk) => {
        drawHandler(chunk, ctx)
    })
}

const drawHandler = (chunk, ctx) => {
    const parts = chunk.split(',')
    switch(parts[0]) {
        case 'A':
            console.log('start', parts)
            MyBrush.start(ctx, parts[1], parts[2])
            break
        case 'B':
            console.log('move', parts)
            MyBrush.move(ctx, parts[1], parts[2], parts[3], parts[4])
            break
        case 'C':
            console.log('end', parts)
            MyBrush.end(ctx)
            break
    }
}

export default drawFromMemory

// const memory = () => {
//     testAction.forEach((act, i) => {
//       setTimeout(() => {
//         console.log('d');
//         drawHandler(act);
//       }, i * 10);
//     });

// case "brush":
//             switch (msg.tool.method) {
//               case "start":
//                 MyBrush.start(ctx, msg.tool.x, msg.tool.y)
//                 break
//               case "stop":
//                 MyBrush.stop(ctx)
//                 break
//               case "move":
//                 MyBrush.move(ctx, msg.tool.x, msg.tool.y, msg.tool.st, msg.tool.wd)
//                 break
//             }
//             break