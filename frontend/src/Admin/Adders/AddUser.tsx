import React, { useState } from 'react';
import './AddUser.css';
import { useUser } from '../../Context/UserContext';
import UsernameUsedModal from '../Modals/UsernameUsedModal';
const AddUser = () => {
    const { updateUserList } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
  });
  const [showUsernameUsedModal, setShowUsernameUsedModal] = useState(false);
  const token = sessionStorage.getItem('token') || '';

  const closeModal = () => {
    setShowUsernameUsedModal(false);
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/persons', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,

        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
        const newUser = await response.json();

        updateUserList(newUser);

        setFormData({ username: '', password: '', role: '' });

      console.log('User added successfully.');
    } else {
      setShowUsernameUsedModal(true);
      console.error('Username already exists.');
    }
  };

  return (
    <div className="add-user-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a Role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>
      {showUsernameUsedModal && (
        <UsernameUsedModal onClose={closeModal} />
      )}
    </div>
  );
};

export default AddUser;
