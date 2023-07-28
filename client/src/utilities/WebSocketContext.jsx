// WebSocketContext.js
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
        method: 'init'
      }))
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = socket;

    return () => {
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
