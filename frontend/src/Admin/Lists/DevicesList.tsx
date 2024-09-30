import React, { useState, useEffect } from 'react';
import DeviceModal from '../Modals/DeviceModal';
import "./DevicesList.css"
import { useDevice } from '../../Context/DeviceContext';

type Device = {
  id:string
description: string;
address: string;
maxHourlyEnergyConsumption: number;
  personUsername: string;
};
const DeviceList: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deviceList , setDevicesList} = useDevice();
  const{updateDevice} = useDevice();
  const{deleteDevice} = useDevice();
  
    const token = sessionStorage.getItem('token') || '';
  const openDeviceModal = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDevice(null);
    setIsModalOpen(false);
  };

  const onUpdate = (updatedDevice: Device) => {
    handleCloseModal();
    fetch(`http://localhost:8081/devices/${updatedDevice?.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,

        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDevice),
    })
  updateDevice(updatedDevice);


  }


  useEffect(() => {
    fetch('http://localhost:8081/devices', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,

        'Content-Type': 'application/json',
      },
    })
        .then((response) => response.json())
        .then((data) => {
          setDevicesList(data);
        })
        .catch((error) => {
          console.error('Error fetching user data', error);
        });
  }, [token]);

  const onDelete = (userId: string) => {
    handleCloseModal();
    fetch(`http://localhost:8081/devices/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    deleteDevice(userId);
  }

  return (
    <div className="device-list-container">
      <h3>Devices List</h3>
      <ul className="device-list">
        {deviceList.map((device) => (
          <li key={device.id} onClick={() => openDeviceModal(device)} className="device-list-item">
            {device.description}
          </li>
        ))}
      </ul>
      {isModalOpen && selectedDevice && (
        <DeviceModal device={selectedDevice} onClose={handleCloseModal}
        onUpdate={onUpdate}
        onDelete={onDelete} />
      )}
    </div>
  );
};

export default DeviceList;