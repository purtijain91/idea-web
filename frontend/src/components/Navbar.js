import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ onPost }) => {
  const { user, logout } = useContext(AuthContext);
console.log("user user======",user)
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <span className="navbar-brand mb-0 h1">💡 Idea Box</span>
      <div>
        {user ? (
          <>
            <span className="me-3">Hi, {user.email}</span>
            <button onClick={logout} className="btn btn-outline-danger btn-sm">
              Logout
            </button>
          </>
        ) : (
          <span className="text-muted">Not Logged In</span>
        )}
        <button onClick={onPost} className="btn btn-primary ms-3">
          + Post Idea
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
