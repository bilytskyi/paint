import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CanvasesContext = createContext();

export const useCanvases = () => {
  return useContext(CanvasesContext);
};

export const CanvasesProvider = ({ children }) => {
  // const activeUsers = useSelector(state => state.canvas.users);
  const [isChange, setIsChange] = useState(false);
  
  const initialSettings = {
    sX: 0,
    sY: 0,
    sW: 1920,
    sH: 1080,
    dX: 0,
    dY: 0,
    dW: 1920,
    dH: 1080,
  };
  
  const canvases = useMemo(() => {
    if (activeUsers === null) {
        setIsChange(false);
        return {};
    }

    const userCanvases = {};

    activeUsers.forEach(([userId, username]) => {
      if (!userCanvases[userId]) {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;
        userCanvases[userId] = { userId, username, canvas, settings: initialSettings };
      }
    });
    setIsChange(true);
    return userCanvases;
  }, [activeUsers]);

  useEffect(() => {
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
