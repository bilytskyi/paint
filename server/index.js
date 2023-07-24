const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const fs = require('fs')
const path = require('path')


// const allowedOrigins = ['http://16.170.240.78', 'http://example.com']

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions))
app.use(cors())
app.use(express.json({ limit: '1000kb' }))

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break
            case 'draw':
                broadcastConnection(ws, msg)
                break
            case 'draw2':
                broadcastConnection(ws, msg)
                break
            case 'init':
                broadcastConnection(ws, msg)
                break
        }
    })
})

// app.post('/image', (req, res) => {
//     try {
//         const data = req.body.img.replace(`data:image/png;base64,`, '')
//         fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
//         return res.status(200).json({message: "Download"})
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json('error')
//     }
// })
// app.get('/image', (req, res) => {
//     try {
//         const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
//         const data = `data:image/png;base64,` + file.toString('base64')
//         res.json(data)
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json('error')
//     }
// })

// for prodaction
// const _dirname = path.dirname("")
// const buildPath = path.join(_dirname, "../client/dist")
// app.use(express.static(buildPath))
// app.get("/*", (req, res) => {
//     try {
//         res.sendFile(
//             path.join(__dirname, "../client/dist/index.html")
//         )
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json('error');
//     }
// })
// for prodaction

app.get('/text', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.txt`));
        const data = file.toString();
        res.send(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
})

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}