// WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://16.170.240.78:5000/");

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({
        method: "init"
      }))
    };

    // Send a heartbeat message every 30 seconds (adjust the interval as needed)
      const heartbeatInterval = setInterval(() => {
        if (socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify({
            method: "heartbeat"
          }));
        }
      }, 30000);

    socket.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = socket;

    return () => {
      clearInterval(heartbeatInterval); // Clear the heartbeat interval when the component unmounts
      socket.close();
    };
  }, []);

  const value = { websocket: wsRef.current, isConnected };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
