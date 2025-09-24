import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const { sendOtp, verifyOtp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleEmail = async (e) => {
    e.preventDefault();
    await sendOtp(email);
    setStep(2);
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    await verifyOtp(email, otp);
    onClose();
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={step === 1 ? handleEmail : handleOtp}>
            <div className="modal-header">
              <h5 className="modal-title">{step === 1 ? "Login" : "Verify OTP"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {step === 1 ? (
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit">
                {step === 1 ? "Send OTP" : "Verify"}
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
