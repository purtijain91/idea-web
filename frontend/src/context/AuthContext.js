import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.get("/auth/refresh", { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    refresh()
  }, []);

  const sendOtp = async (email) => {
    await api.post("/auth/send-otp", { email }, { withCredentials: true });
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post(
      "/auth/verify-otp",
      { email, otp },
      { withCredentials: true }
    );
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
