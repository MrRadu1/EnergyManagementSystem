import React, { useState, useEffect } from 'react';
import UserModal from '../Modals/UserModal';
import "./UsersList.css"
import { useDevice } from '../../Context/DeviceContext';
import { useUser } from '../../Context/UserContext';
import UsernameUsedModal from "../Modals/UsernameUsedModal";
type User = {
  id: string;
  username: string;
    password: string;
    role: string;
};

const UserList: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userList , setUsersList} = useUser();
  const{updateUser} = useUser();
  const{deleteUser} = useUser();
  const{refreshDevices} = useDevice();
  const [showUsernameUsedModal, setShowUsernameUsedModal] = useState(false);

     const token = sessionStorage.getItem('token') || '';
  const closeModal = () => {
    setShowUsernameUsedModal(false);
  };


  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("Token is ", token);
    fetch('http://localhost:8080/persons', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,

        'Content-Type': 'application/json',
      },
    })
        .then((response) => response.json())
        .then((data: User[]) => {
          setUsersList(data);
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
        });
  }, [token]);

  const onUpdate = async (updatedUser: User) => {
    handleCloseModal();
    console.log("Token is ", token);
    try {
      const response = await fetch(`http://localhost:8080/persons/${updatedUser?.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        updateUser(updatedUser);
      } else {
        setShowUsernameUsedModal(true);
      }

    } catch (error) {
      console.log("Error updating user", error);
    }
  }

  const onDelete = (userId: string) => {
    handleCloseModal();
    fetch(`http://localhost:8080/persons/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
        .then(() => {
          deleteUser(userId);
        })
        .then(() => {
          refreshDevices();
        })
        .catch((error) => {
          console.error('Error deleting user', error);
        });
  };

  return (
    <div className="user-list-container">
      <h3>User List</h3>
      <ul className="user-list">
        {userList.map((user) => (
          <li key={user.id} onClick={() => openUserModal(user)} className="user-list-item">
            {user.username}
          </li>
        ))}
      </ul>
      {isModalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
      {showUsernameUsedModal && (
          <UsernameUsedModal onClose={closeModal} />
      )}
    </div>
  );
};

export default UserList;