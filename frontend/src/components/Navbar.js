import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal"; // Import the LoginModal component

const Navbar = ({ onPost }) => {
  const { user, logout } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  console.log("user user======", user);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <div className="container-fluid">
          {/* Brand */}
          <span className="navbar-brand mb-0 h1 fw-bold text-primary">
            💡 Idea Box
          </span>

          {/* Right side content */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                {/* User info */}
                <div className="d-flex align-items-center me-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{width: '32px', height: '32px'}}>
                    <span className="text-white fw-bold small">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-dark fw-medium">
                    Hi, {user.email}
                  </span>
                </div>

                {/* Post Idea Button */}
                <button 
                  onClick={onPost} 
                  className="btn btn-primary me-2"
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Post Idea
                </button>

                {/* Logout Button */}
                <button 
                  onClick={logout} 
                  className="btn btn-outline-danger btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button 
                  onClick={handleLoginClick} 
                  className="btn btn-outline-primary me-2"
                >
                  Login
                </button>

                {/* Post Idea Button (disabled when not logged in) */}
                <button 
                  onClick={user ? onPost : handleLoginClick} 
                  className="btn btn-primary"
                  title={!user ? "Please login to post ideas" : ""}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Post Idea
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={handleCloseModal} />
      )}
    </>
  );
};

export default Navbar;