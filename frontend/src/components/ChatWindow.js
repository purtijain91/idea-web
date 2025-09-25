import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatWindow = ({ otherUserId }) => {
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, joinRoom } = useContext(ChatContext);
  const [text, setText] = useState("");
  

  const roomId = [user._id, otherUserId].sort().join("_"); // unique room

  React.useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  const handleSend = () => {
    const msg = { sender: user._id, text };
    sendMessage(roomId, msg);
    setText("");
  };

  return (
    <div className="border p-2" style={{ maxHeight: "400px", overflowY: "scroll" }}>
      {messages.map((m, i) => (
        <div key={i} className={m.sender === user._id ? "text-end" : "text-start"}>
          <span className="badge bg-primary">{m.text}</span>
        </div>
      ))}
      <div className="input-group mt-2">
        <input
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
