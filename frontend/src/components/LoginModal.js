import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginModal = ({ onClose }) => {
  const { sendOtp, verifyOtp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await verifyOtp(email, otp);
      window.location.reload()
      onClose();
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <form onSubmit={step === 1 ? handleEmail : handleOtp}>
            {/* Header */}
            <div className="modal-header border-0 pb-0">
              <div className="text-center w-100">
                <h4 className="modal-title fw-bold text-primary">
                  💡 Welcome to Idea Box
                </h4>
                <p className="text-muted mb-0">
                  {step === 1 ? "Enter your email to get started" : "Enter the OTP sent to your email"}
                </p>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body px-4 py-3">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              {step === 1 ? (
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <div className="form-text">
                    We'll send you a one-time password to verify your identity.
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <div className="text-center mb-3">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '60px', height: '60px'}}>
                      <i className="bi bi-envelope-check text-primary" style={{fontSize: '24px'}}></i>
                    </div>
                    <p className="mt-2 mb-0 small text-muted">
                      OTP sent to <strong>{email}</strong>
                    </p>
                  </div>
                  
                  <label htmlFor="otp" className="form-label fw-medium">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className="form-control form-control-lg text-center"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    disabled={loading}
                    style={{letterSpacing: '0.5rem', fontSize: '1.2rem'}}
                  />
                  
                  <div className="text-center mt-3">
                    <button 
                      type="button" 
                      className="btn btn-link text-decoration-none p-0"
                      onClick={handleBackToEmail}
                      disabled={loading}
                    >
                      ← Change email address
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-0">
              <div className="d-grid gap-2 w-100">
                <button 
                  className="btn btn-primary btn-lg" 
                  type="submit"
                  disabled={loading || (step === 1 ? !email : !otp)}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {step === 1 ? "Sending..." : "Verifying..."}
                    </>
                  ) : (
                    step === 1 ? "Send OTP" : "Verify & Login"
                  )}
                </button>
                
                <button 
                  type="button"
                  className="btn btn-outline-secondary" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;