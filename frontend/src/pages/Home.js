import React, { useContext, useState } from "react";
import { IdeaContext } from "../context/IdeaContext";
import ChatBubble from "../components/ChatBubble";
import PostModal from "../components/PostModal";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext)
  const { ideas, likeIdea, commentIdea } = useContext(IdeaContext);
  const [showModal, setShowModal] = useState(false);
console.log("ideas==========",ideas.ideas)
  return (
    <>
      <Navbar onPost={() => setShowModal(true)} />
      <div className="container mt-4">
       <div className="row mx-0">
         {ideas?.ideas?.map((idea) => (
          <ChatBubble
            key={idea._id}
            idea={idea}
            onLike={likeIdea}
            onComment={commentIdea}
            currentUser={user}
          />
        ))}
       </div>
      </div>
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Home;
