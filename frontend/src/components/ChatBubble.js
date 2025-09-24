import React, { useState } from "react";

const ChatBubble = ({ idea, onLike, onComment }) => {
  const [comment, setComment] = useState("");

  return (
    <div className="card my-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{idea.user?.email}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{idea.title}</h6>
        <p className="card-text">{idea.description}</p>

        {idea.files?.map((file, i) =>
          file.endsWith(".mp4") ? (
            <video key={i} src={file} controls className="w-100 rounded mb-2" />
          ) : (
            <img key={i} src={file} alt="" className="w-100 rounded mb-2" />
          )
        )}

        <button
          onClick={() => onLike(idea._id)}
          className="btn btn-outline-danger btn-sm me-2"
        >
          ❤️ {idea.likes.length}
        </button>

        <div className="input-group input-group-sm mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              onComment(idea._id, comment);
              setComment("");
            }}
          >
            Send
          </button>
        </div>

        <ul className="list-unstyled mt-2">
          {idea.comments.map((c, idx) => (
            <li key={idx}>
              <b>{c.user?.email}</b>: {c.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatBubble;
