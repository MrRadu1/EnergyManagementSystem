import React, { useState } from 'react';
import './UserModal.css';
import UsernameUsedModal from "./UsernameUsedModal";
type User = {
  id: string;
  username: string;
  password: string;
  role: string;
};

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
  onDelete: (userId: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);




  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    onUpdate(updatedUser as User);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDelete(user!.id);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {user && (
          <>
            {isEditing ? (
              <div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name="username"
                  value={updatedUser!.username}
                  onChange={(e) => setUpdatedUser({ ...updatedUser!, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="text"
                  name="password"
                  value={updatedUser!.password}
                  onChange={(e) => setUpdatedUser({ ...updatedUser!, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                  name="role"
                  value={updatedUser!.role}
                  onChange={(e) => setUpdatedUser({ ...updatedUser!, role: e.target.value })}
                >
                     <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
              </div>
              <div className="form-group">
                <button onClick={handleUpdateClick}>Update</button>
                <button onClick={handleDeleteClick}>Delete</button>
                <button onClick={onClose}>Close</button>
              </div>
            </div>
            
            ) : (
              <>
            <div><span style={{ fontStyle: 'italic' }}>Id:</span> <span style={{ fontWeight: 'bold' }}>{user.id}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Username:</span> <span style={{ fontWeight: 'bold' }}>{user.username}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Password:</span> <span style={{ fontWeight: 'bold' }}>{user.password}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Role:</span> <span style={{ fontWeight: 'bold' }}>{user.role}</span></div>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
            <button onClick={onClose}>Close</button>
              </>
            )}
            
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
