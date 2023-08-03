import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CanvasesContext = createContext();

export const useCanvases = () => {
  return useContext(CanvasesContext);
};

export const CanvasesProvider = ({ children }) => {
  const activeUsers = useSelector(state => state.canvas.users);
  const [isChange, setIsChange] = useState(false); // New state variable

  const canvases = useMemo(() => {
    if (activeUsers === null) {
        setIsChange(false);
        return {}; // Return an empty object if activeUsers is null
    }

    const userCanvases = {};

    activeUsers.forEach(([userId, username]) => {
      if (!userCanvases[userId]) {
        const canvas = document.createElement('canvas');
        canvas.width = 1920
        canvas.height = 1080
        // Configure the canvas size and other properties as needed
        userCanvases[userId] = { userId, username, canvas };
      }
    });
    setIsChange(true)
    return userCanvases;
  }, [activeUsers]);

  useEffect(() => {
    console.log("CHANGE!")
    if (isChange) {
      setIsChange(false);
    }
  }, [isChange]);

  const value = { canvases, isChange };

  return (
    <CanvasesContext.Provider value={value}>
      {children}
    </CanvasesContext.Provider>
  );
};
