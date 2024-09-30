import React from 'react';
import './Login.css';
interface LoginFailedModalProps {
    onClose: () => void;
  }
  
  const LoginFailedModal: React.FC<LoginFailedModalProps> = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Login Failed</h3>
        <p>Your login attempt was unsuccessful. Please try again.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoginFailedModal;