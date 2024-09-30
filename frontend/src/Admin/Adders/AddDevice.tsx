import React, { useState } from 'react';
import './AddDevice.css';
import { useDevice } from '../../Context/DeviceContext';
import { useUser } from '../../Context/UserContext';
const AddDevice = () => {
    const{updateDeviceList} = useDevice();
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    maxHourlyEnergyConsumption: 0,
    personUsername: '',
  });

  const { userList } = useUser();
  const token = sessionStorage.getItem('token') || '';
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8081/devices', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
        const newDevice = await response.json();


        updateDeviceList(newDevice);
        setFormData({ description: '', address: '', maxHourlyEnergyConsumption: 0, personUsername: '' });

      console.log('Device added successfully.');
    } else {
      console.error('Error adding device.');
    }
  };

  return (
    <div className="add-device-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxHourlyEnergyConsumption">Max Hourly Energy Consumption:</label>
          <input
            type="number"
            id="maxHourlyEnergyConsumption"
            name="maxHourlyEnergyConsumption"
            value={formData.maxHourlyEnergyConsumption}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="personUsername">Person Username:</label>
          <select
            id="personUsername"
            name="personUsername"
            value={formData.personUsername}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a user</option>
            <option value="empty">Empty</option>
            {userList.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Device</button>
      </form>
    </div>
  );
};

export default AddDevice;
