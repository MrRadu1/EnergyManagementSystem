import React from 'react';
import { useState } from 'react';
import { useUser } from '../../Context/UserContext';
type Device = {
    id:string
  description: string;
  address: string;
  maxHourlyEnergyConsumption: number;
    personUsername: string;
};

interface DeviceModalProps {
  device: Device | null;
  onClose: () => void;
  onUpdate: (updatedUser: Device) => void;
  onDelete: (userId: string) => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ device, onClose , onUpdate, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDevice, setUpdatedDevice] = useState(device);
    const { userList } = useUser();
    const handleEditClick = () => {
        setIsEditing(true);
      };
    
      const handleUpdateClick = () => {
        onUpdate(updatedDevice as Device);
        setIsEditing(false);
      };
    
      const handleDeleteClick = () => {
        onDelete(device!.id);
      };

    return (
    <div className="modal">
      <div className="modal-content">
        {device && (
          <>
            {isEditing ? (
              <div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  type="text"
                  name="description"
                  value={updatedDevice!.description}
                  onChange={(e) => setUpdatedDevice({ ...updatedDevice!, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={updatedDevice!.address}
                  onChange={(e) => setUpdatedDevice({ ...updatedDevice!, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="maxHourlyEnergyConsumption">Max Hourly Energy Consumption:</label>
                <input
                  type="number"
                  name="maxHourlyEnergyConsumption"
                  value={updatedDevice!.maxHourlyEnergyConsumption}
                  onChange={(e) => setUpdatedDevice({
                    ...updatedDevice!,
                    maxHourlyEnergyConsumption: parseFloat(e.target.value) || 0,
                  })}
                />
              </div>
              <div className="form-group">
        <label htmlFor="personUsername">Person Username:</label>
          <select
            id="personUsername"
            name="personUsername"
            value={updatedDevice!.personUsername}
            onChange={(e) => setUpdatedDevice({ ...updatedDevice!, personUsername: e.target.value })}
            required
          >
            <option value="">Empty</option>
            {userList.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
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
            <div><span style={{ fontStyle: 'italic' }}>Id:</span> <span style={{ fontWeight: 'bold' }}>{device.id}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Description:</span> <span style={{ fontWeight: 'bold' }}>{device.description}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Address:</span> <span style={{ fontWeight: 'bold' }}>{device.address}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Max Hourly Energy Consumption:</span> <span style={{ fontWeight: 'bold' }}>{device.maxHourlyEnergyConsumption}</span></div>
            <div><span style={{ fontStyle: 'italic' }}>Person Username:</span> <span style={{ fontWeight: 'bold' }}>{device.personUsername}</span></div>
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

export default DeviceModal;
