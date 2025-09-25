import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const IdeaContext = createContext();

export const IdeaProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const res = await api.get("/ideas");
    setIdeas(res.data);
  };

  const postIdea = async (title, description, files) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    for (let file of files) formData.append("files", file);
    console.log("logging formdata", formData);
    try {
      const res = await api.post("/ideas/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIdeas([res.data, ...ideas]);
    } catch (err) {
      console.log("Error posting idea:", err.response?.data || err.message);
    }
  };

  const likeIdea = async (id) => {
    console.log("i am in like api")
    const res = await api.put(
      `/ideas/${id}/like`,
      {},
      { withCredentials: true }
    );
    console.log("i have made like")
    // setIdeas((prevIdeas) =>
    //   prevIdeas.ideas.map((i) => (i._id === id ? res.data : i))
    // );
    setIdeas(ideas.ideas.map((i) => (i._id === id ? res.data : i)));
    window.location.reload()
  };

  const commentIdea = async (id, text) => {
    const res = await api.post(
      `/ideas/${id}/comment`,
      { text },
      { withCredentials: true }
    );
    // setIdeas(ideas.ideas.map((i) => (i._id === id ? res.data : i)));
    setIdeas(ideas.ideas.map((i) => (i._id === id ? res.data : i)));
    window.location.reload()

  };

  return (
    <IdeaContext.Provider value={{ ideas, postIdea, likeIdea, commentIdea, fetchIdeas }}>
      {children}
    </IdeaContext.Provider>
  );
};
