import React, { useState } from "react";
import ChatWindow from "./ChatWindow"; // import the chat component
import LoginModal from "./LoginModal"; // import the login modal

const ChatBubble = ({ idea, onLike, onComment, currentUser }) => {
  const [comment, setComment] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Check if this idea belongs to the current user
  const isMyIdea = currentUser && idea.user?._id === currentUser._id;

  // Function to check authentication before actions
  const checkAuthAndExecute = (action) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  // Handle like with authentication check
  const handleLike = () => {
    checkAuthAndExecute(() => onLike(idea._id));
  };

  // Handle chat with authentication check
  const handleChat = () => {
    checkAuthAndExecute(() => setShowChat(true));
  };

  // Handle comment with authentication check
  const handleComment = () => {
    if (!comment.trim()) return;
    checkAuthAndExecute(() => {
      onComment(idea._id, comment);
      setComment("");
    });
  };

  // Handle comment input key press
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && comment.trim()) {
      handleComment();
    }
  };

  return (
    <>
      <div className="col-md-6 col-lg-4 mb-3">
        <div className="card h-100 border shadow-sm">
          {/* Media Preview */}
          {idea.files && idea.files.length > 0 && (
            <div className="position-relative">
              {idea.files[0].endsWith(".mp4") ? (
                <video 
                  src={idea.files[0]} 
                  className="card-img-top"
                  style={{height: '200px', objectFit: 'cover'}}
                  muted
                />
              ) : (
                <img 
                  src={idea.files[0]} 
                  className="card-img-top"
                  style={{height: '200px', objectFit: 'cover'}}
                  alt=""
                />
              )}
              {idea.files.length > 1 && (
                <span className="position-absolute top-0 end-0 badge bg-dark m-2">
                  +{idea.files.length - 1}
                </span>
              )}
              {/* Your Idea Badge */}
              {isMyIdea && (
                <span className="position-absolute top-0 start-0 badge bg-success m-2">
                  ✨ Your Idea
                </span>
              )}
            </div>
          )}

          <div className="card-body p-3">
            {/* User info */}
            <div className="d-flex align-items-center mb-2">
              <div className={`${isMyIdea ? 'bg-success' : 'bg-primary'} rounded-circle d-flex align-items-center justify-content-center me-2`} 
                   style={{width: '28px', height: '28px', fontSize: '12px'}}>
                <span className="text-white fw-bold">
                  {idea.user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <small className="text-muted me-2">{idea.user?.email || 'Anonymous'}</small>
                {isMyIdea && (
                  <span className="badge bg-success-subtle text-success border border-success" style={{fontSize: '10px'}}>
                    Your Idea
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h6 className={`card-title mb-2 fw-bold ${isMyIdea ? 'text-success' : ''}`}>
              {idea.title}
              {isMyIdea && <span className="ms-2">✨</span>}
            </h6>
            
            {/* Description */}
            <p className="card-text text-muted small mb-3">
              {expanded ? idea.description : 
               idea.description?.length > 80 ? 
               idea.description.substring(0, 80) + '...' : 
               idea.description}
              {idea.description?.length > 80 && (
                <button 
                  className="btn btn-link p-0 ms-1 small text-decoration-none"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </p>

            {/* Action buttons */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="btn-group btn-group-sm">
                <button
                  onClick={handleLike}
                  className={`btn ${currentUser ? 'btn-outline-danger' : 'btn-outline-secondary'}`}
                  style={{fontSize: '12px'}}
                  title={!currentUser ? "Login to like this idea" : ""}
                >
                  ❤️ {idea.likes?.length || 0}
                </button>
                <button
                  onClick={handleChat}
                  className={`btn ${currentUser ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                  style={{fontSize: '12px'}}
                  title={!currentUser ? "Login to chat" : ""}
                >
                  💬 Chat
                </button>
              </div>
              <small className="text-muted">
                {idea.comments?.length || 0} comments
              </small>
            </div>

            {/* Quick comment */}
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={currentUser ? "Quick comment..." : "Login to comment..."}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{fontSize: '12px'}}
                onKeyPress={handleCommentKeyPress}
                onFocus={() => {
                  if (!currentUser) {
                    setShowLoginModal(true);
                  }
                }}
                readOnly={!currentUser}
              />
              <button
                className={`btn ${currentUser ? 'btn-outline-secondary' : 'btn-outline-secondary'}`}
                onClick={handleComment}
                disabled={!comment.trim() || !currentUser}
                style={{fontSize: '12px'}}
                title={!currentUser ? "Login to comment" : ""}
              >
                Send
              </button>
            </div>

            {/* Recent comments */}
            {idea.comments && idea.comments.length > 0 && (
              <div className="mt-2">
                <div className="small text-muted">
                  <strong>{idea.comments[idea.comments.length - 1].user?.email}</strong>: 
                  <span className="ms-1">
                    {idea.comments[idea.comments.length - 1].text?.length > 30 ? 
                     idea.comments[idea.comments.length - 1].text.substring(0, 30) + '...' :
                     idea.comments[idea.comments.length - 1].text}
                  </span>
                </div>
                {idea.comments.length > 1 && (
                  <button 
                    className="btn btn-link p-0 small text-decoration-none"
                    onClick={handleChat}
                  >
                    View all {idea.comments.length} comments
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Compact Chat Modal */}
      {showChat && currentUser && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title mb-0">
                  💬 Chat with {idea.user?.email || 'User'}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowChat(false)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{height: '50vh'}}>
                <ChatWindow otherUserId={idea.user?._id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Grid Container Component (use this to wrap your ideas)
export const IdeaGrid = ({ ideas, onLike, onComment, currentUser }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {ideas.map((idea) => (
          <ChatBubble 
            key={idea._id} 
            idea={idea} 
            onLike={onLike} 
            onComment={onComment}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatBubble;