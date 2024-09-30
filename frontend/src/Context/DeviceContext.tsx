import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import {CompatClient, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface Device {
  id:string;
description: string;
address: string;
maxHourlyEnergyConsumption: number;
  personUsername: string;
}

export interface DeviceWarnings {
  id:string;
  warning: boolean;
}

interface DeviceR {
  id:string;
  deviceId:string;
  hour:  number;
  measurementValue: number;
};



interface DeviceContextValue {
  deviceList: Device[];
  deviceWarnings: DeviceWarnings[];
  updateDeviceList: (newDevice: Device) => void;
  updateDevice: (updatedDevice: Device) => void;
  deleteDevice: (deviceId: string) => void;
  refreshDevices: () => void;
  addDeviceWarningToList: (deviceWarning: DeviceWarnings) => void;
  stompClient: CompatClient | null;
  device : DeviceR;
  clientChat : CompatClient | null;
  setStompClient: (client: CompatClient | null) => void;
  setDevicesList: (data: Device[]) => void;
}

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [deviceWarnings, setDeviceWarnings] = useState<DeviceWarnings[]>([]);
  const [stompClient, setStompClient_] = useState<CompatClient | null>(null);
    const [clientChat, setClient] = useState<CompatClient | null>(null);
    const token = sessionStorage.getItem('token') || '';
  const initialDeviceState = {
    id: "0",
    deviceId: "0",
    hour: 0,
    measurementValue: 0,
  };
  const [device, setDevice] = useState<DeviceR>(initialDeviceState);

  const setStompClient = (client: CompatClient | null) => {
    setClient(client);
  }

  const addDeviceWarningToList = (deviceWarning: DeviceWarnings) => {
    const existingIndex = deviceWarnings.findIndex(obj => obj.id === deviceWarning.id);
    if (existingIndex !== -1) {
      // Item with the same id exists, update it
      const updatedList = [...deviceWarnings];
      updatedList[existingIndex] = deviceWarning;
      setDeviceWarnings(updatedList);
    } else {
      setDeviceWarnings(prevWarnings => [...prevWarnings, deviceWarning]);
    }
  };



  useEffect(() => {
    const dev = deviceList.find((listDevice) => listDevice.id === device.deviceId);
    console.log("here");
    if (dev) {
      console.log("here1");
      const newWarn = { id: dev.id, warning: false};
      console.log("here2" + dev.maxHourlyEnergyConsumption + " " + device.measurementValue);
      if (dev.maxHourlyEnergyConsumption < device!.measurementValue) {
        console.log("here3");
        newWarn.warning = true;
      }
      addDeviceWarningToList(newWarn);
      deviceWarnings.map((item) => { console.log("xa" + item.id + " " + item.warning); });
    }
  } , [device, deviceList]);

  const updateDeviceList = (newDevice: Device) => {
    setDeviceList([...deviceList, newDevice]);
  };

  const deleteDevice = (deviceId: string) => {
    const updatedDevices = deviceList.filter((device) => device.id !== deviceId);
    setDeviceList(updatedDevices);
  };
  
  const updateDevice = (updatedDevice: Device) => {
    const deviceIndex = deviceList.findIndex((device) => device.id === updatedDevice.id);
    
    if (deviceIndex !== -1) {
      const updatedDevices = [...deviceList];
      updatedDevices[deviceIndex] = updatedDevice;
      setDeviceList(updatedDevices);
    }
  };

    const refreshDevices = () => {
        fetch('http://localhost:8081/devices', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setDeviceList(data);
            })
            .catch((error) => {
                console.error('Error fetching device data', error);
            });
    };


    const setDevicesList = (data: Device[]) => {
        setDeviceList(data);
    }


  useEffect(() => {
    const websocket = new SockJS('http://localhost:8082/websocket');
    const client = Stomp.over(websocket);
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    client.connect({}, () => {
      console.log('Stomp client connected');
      // Subscription and message sending here
      client.subscribe(`/topic/message`, (message) => {
        console.log('Received message:', message.body);
        setDevice(JSON.parse(message.body));
        console.log(device);
      });
    });
    setStompClient_(client);
    return () => {
      client.disconnect(() => {
        console.log('WebSocket connection closed');
      });
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ deviceList, deviceWarnings, updateDeviceList, updateDevice, deleteDevice,refreshDevices, addDeviceWarningToList, stompClient, device, clientChat, setStompClient, setDevicesList}}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
