import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const sessionID = useSelector(state => state.canvas.sessionID)
  const userName = useSelector(state => state.canvas.username)
  const userId = useSelector(state => state.canvas.userId)
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectIntervalRef = useRef(null);

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://16.170.240.78:5000/");
    // const socket = new WebSocket("ws://localhost:5000/");
    socket.onopen = () => {
      console.log('i open socket')
      setIsConnected(true);
      socket.send(JSON.stringify({
        method: "init",
        id: sessionID,
        user: userName,
        userid: userId
      }))
      clearInterval(reconnectIntervalRef.current);
    };

    socket.onclose = () => {
      console.log('i close socket')
      setIsConnected(false);
      scheduleReconnect();
    };

    wsRef.current = socket;
  };

  const scheduleReconnect = () => {
    const reconnectInterval = 3000; // Adjust the interval as needed
    reconnectIntervalRef.current = setInterval(() => {
      console.log('Attempting to reconnect...');
      connectWebSocket();
    }, reconnectInterval);
  };

  useEffect(() => {
    connectWebSocket();

    const heartbeatInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === wsRef.current.OPEN) {
        wsRef.current.send(JSON.stringify({
          method: "heartbeat",
          id: sessionID,
          user: userName,
          userid: userId
        }));
      }
    }, 5000);

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(reconnectIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionID]);

  const value = { websocket: wsRef.current, isConnected };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
