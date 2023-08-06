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
            case 'heartbeat':
                broadcastConnection(ws, msg)
                break
            case 'init':
                broadcastConnection(ws, msg)
                break
            case 'users':
                broadcastConnection(ws, msg)
                break
            case 'update':
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

app.post('/users', (req, res) => {
    try {
        const data = req.body.user
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.txt`)
        fs.appendFileSync(filePath, data + '\n')
        return res.status(200).json({message: "user added"})
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})

app.get('/users', (req, res) => {
    try {
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.txt`);
        const data = fs.readFileSync(filePath, 'utf-8');
        const usersArray = data.trim().split('\n');

        return res.status(200).json(usersArray);
    } catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
})

app.post('/actions', (req, res) => {
    try {
        const data = JSON.stringify(req.body.data); // Convert to JSON format
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.txt`);
        fs.writeFileSync(filePath, data);
        return res.status(200).json({ message: "Actions saved", data: data });
    } catch (e) {
        console.error(e);
        return res.status(500).json('Error');
    }
});

app.get('/actions', (req, res) => {
    try {
        const filePath = path.resolve(__dirname, 'files', `${req.query.id}.txt`);
        const data = fs.readFileSync(filePath, 'utf-8');
        const actions = JSON.parse(data); // Parse JSON data
        return res.status(200).json(actions);
    } catch (e) {
        console.error(e);
        return res.status(500).json('Error');
    }
});

// for prodaction
// const _dirname = path.dirname("")
const buildPath = path.join(__dirname, "../client/dist")
app.use(express.static(buildPath))
app.get("/*", (req, res) => {
    try {
        res.sendFile(
            path.join(__dirname, "../client/dist/index.html")
        )
    } catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
})
// for prodaction

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
        if (msg.method === 'heartbeat' || msg.method === 'init') {
            // Store or update the active user information in the specific room
            updateUserActivity(msg.id, msg.user, msg.userid);
          }
    })
}

// Define a data structure to store active users in each room
const activeUsersByRoom = {};

// Function to update or store active user information in a specific room
const updateUserActivity = (room, user, userid) => {
  // Ensure the room exists in the data structure
  if (!activeUsersByRoom[room]) {
    activeUsersByRoom[room] = {};
  }
  // Store the current timestamp as the last active time for the user in the room
  activeUsersByRoom[room][userid] = {username: user, date: Date.now()};
};

// Function to check and clean up inactive users and empty rooms
const cleanupInactiveUsersAndRooms = () => {
  const now = Date.now();
  const inactiveThreshold = 60000; // Set your desired threshold (e.g., 1 minute)

  for (const room in activeUsersByRoom) {
    for (const user in activeUsersByRoom[room]) {
      if (now - activeUsersByRoom[room][user].date > inactiveThreshold) {
        // Remove user from the room's active users
        delete activeUsersByRoom[room][user];
      }
    }

    // Check if the room has zero active users
    if (Object.keys(activeUsersByRoom[room]).length === 0) {
      // Remove the room if it's empty
      delete activeUsersByRoom[room];
    }
  }
};

const broadcastConnectionActive = () => {
    aWss.clients.forEach(client => {
      // Check if the client is associated with a room
      if (client.id) {
        const activeUsersInRoom = activeUsersByRoom[client.id];
        
        // Create a message containing active user information for the room
        const activeUsersMsg = JSON.stringify({
          method: 'users',
          id: client.id,
          users: activeUsersInRoom
        });
  
        // Send the active user information to the client
        client.send(activeUsersMsg);
      }
    });
  };
  
  // Regularly broadcast active user information to clients every 30 seconds
  setInterval(broadcastConnectionActive, 3000);


// Regularly perform cleanup of inactive users and empty rooms
setInterval(cleanupInactiveUsersAndRooms, 6000); // Adjust the interval as needed