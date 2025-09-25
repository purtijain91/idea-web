import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const s = io("http://localhost:3000"); // your backend
    setSocket(s);

    s.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => s.disconnect();
  }, []);

  const sendMessage = (roomId, message) => {
    if (socket) {
      socket.emit("sendMessage", { roomId, message });
      setMessages((prev) => [...prev, message]);
    }
  };

  const joinRoom = (roomId) => {
    if (socket) socket.emit("joinRoom", roomId);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, joinRoom }}>
      {children}
    </ChatContext.Provider>
  );
};
