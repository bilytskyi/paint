const btn = document.getElementById('btn')
const socket = new WebSocket('ws://localhost:5000/')

socket.onopen = () => {
    socket.send(JSON.stringify({
        method: 'connection',
        id: 555,
        username: 'Andy'
    }))
}

socket.onmessage = (event) => {
    console.log('New message from server:', event.data)
}


btn.onclick = () => {
    socket.send(JSON.stringify({
        message: 'Hello',
        method: 'message',
        id: 555,
        username: 'Andy'
    }))
}