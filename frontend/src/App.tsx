import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './User/Dashboard';
import AdminPage from './Admin/AdminPage';
import EnergyConsumptionPage from "./User/EnergyConsumptionPage";
import {DeviceProvider} from "./Context/DeviceContext";
import {UserProvider} from "./Context/UserContext";

const App = () => {
  return (
      <UserProvider>
      <DeviceProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
          <Route path="/energyConsumption/:username" element={<EnergyConsumptionPage />} />
      </Routes>
    </Router>
    </DeviceProvider>
      </UserProvider>
  );
};

export default App;