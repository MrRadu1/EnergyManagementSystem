import React from 'react';
interface UsernameUsedModalProps {
    onClose: () => void;
  }
  
  const UsernameUsedModal: React.FC<UsernameUsedModalProps> = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>User adding failed</h3>
        <p>This username already exist.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UsernameUsedModal;