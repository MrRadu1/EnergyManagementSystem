import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import LoginFailedModal from './LoginFailedModal';
import { DeviceProvider } from "../Context/DeviceContext";
import {UserProvider} from "../Context/UserContext";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginFailedModal, setShowLoginFailedModal] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/persons/login', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
  
        const result = await response.text();
        const token = JSON.parse(atob(result.split('.')[1]));
        const userData = { role: token.role, username: token.username };
        sessionStorage.setItem('token', result);
        sessionStorage.setItem('userData', JSON.stringify(userData) );

        if (userData.role === 'ADMIN')
          navigate('/admin');
        else 
          navigate('/client');

      } else {
        setShowLoginFailedModal(true);
        console.log('Login failed!');
      }
    } catch (error) {
        setShowLoginFailedModal(true);
      console.log('Error during login:', error);
    }
  };

  const closeModal = () => {
    setShowLoginFailedModal(false);
  };


  return (
      <UserProvider>
      <DeviceProvider>

      <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
      {showLoginFailedModal && (
        <LoginFailedModal onClose={closeModal} />
      )}
    </div>

</DeviceProvider>
</UserProvider>
  );
};

export default Login;