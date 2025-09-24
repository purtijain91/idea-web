import React, { useState, useContext } from "react";
import { IdeaContext } from "../context/IdeaContext";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const PostModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const { postIdea, fetchIdeas } = useContext(IdeaContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLogin(true);
      return;
    }
    await postIdea(title, description, files);
    await fetchIdeas()
    onClose();
  };

  const handlePostAfterLogin = async () => {
    console.log("i am in handlepost after login")
    await postIdea(title, description, files);
    onClose();

//   if (user) {
//     console.log("yes i get user",user)
//   }
};


  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Post an Idea</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="form-control"
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {showLogin && <LoginModal
    onClose={() => {
      setShowLogin(false);
      handlePostAfterLogin();
    }}
  />}
    </div>
  );
};

export default PostModal;
