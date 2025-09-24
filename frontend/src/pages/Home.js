import React, { useContext, useState } from "react";
import { IdeaContext } from "../context/IdeaContext";
import ChatBubble from "../components/ChatBubble";
import PostModal from "../components/PostModal";
import Navbar from "../components/Navbar";

const Home = () => {
  const { ideas, likeIdea, commentIdea } = useContext(IdeaContext);
  const [showModal, setShowModal] = useState(false);
console.log("ideas==========",ideas.ideas)
  return (
    <>
      <Navbar onPost={() => setShowModal(true)} />
      <div className="container mt-4">
        {ideas?.ideas?.map((idea) => (
          <ChatBubble
            key={idea._id}
            idea={idea}
            onLike={likeIdea}
            onComment={commentIdea}
          />
        ))}
      </div>
      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Home;
