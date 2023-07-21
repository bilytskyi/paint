class WebSocketService {
    constructor() {
      this.socket = null;
    }
  
    connect(sessionID, userName) {
      this.socket = new WebSocket(`wss://paint-bilytskyi.vercel.app/?id=${sessionID}`);
      this.socket.onopen = () => {
        console.log('Connection...');
        this.socket.send(
          JSON.stringify({
            id: sessionID,
            username: userName,
            method: 'connection',
          })
        );
      };
  
      this.socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // Handle incoming messages here
      };
    }
  
    send(message) {
      if (this.socket) {
        this.socket.send(JSON.stringify(message));
      }
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  
    // Add an event listener to handle incoming messages from the server
    onMessage(callback) {
      if (this.socket) {
        this.socket.onmessage = (event) => {
          callback(event.data);
        };
      }
    }
  }
  
  export default new WebSocketService();