import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {DeviceProvider, useDevice, DeviceWarnings} from "../Context/DeviceContext";


const Dashboard = () => {

    interface Message {
        message : string;
         sender: string;
       receiver: string;
        timestamp : number;
        isSent: boolean;
    }

  const [data, setData] = useState<{
      id: string;
      description: string;
      address: string;
      maxHourlyEnergyConsumption: number;
      personUsername: string }[]>([]);
  const userDataJSON = sessionStorage.getItem('userData');
  const userData = userDataJSON ? JSON.parse(userDataJSON) : null;
  const navigate = useNavigate();
  const {device}    = useDevice();
    const { deviceWarnings } = useDevice();
    const [list, setList] = useState<DeviceWarnings[]>([]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [notification, setNotification] = useState('');
    const [notificationType, setNotificationType] = useState(false);
    const [clientChat, setClient] = useState<CompatClient | null>(null);

  useEffect(() => {
    if (userData === null || userData.role!=='USER')
      navigate("/");
    else {
        const endpointUrl = `http://localhost:8081/devices/byPerson/${userData.username}`;
    fetch(endpointUrl, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    }
  }, []);

useEffect(() => {
    const ws = new SockJS('http://localhost:8085/chatWS')
    const client = Stomp.over(ws);
    ws.onopen = () => {
        console.log('WebSocket connection established');
    };
    client.connect({}, () => {
        console.log('Stomp client connected');
        // Subscription and message sending here
        client.subscribe(`/chat/${userData.username}/message`, (message) => {
            var jsonMesssage = JSON.parse(message.body);
            console.log("Message json is ", jsonMesssage);
            setMessages((prevMessages) => [...prevMessages, { ...jsonMesssage, isSent: false }]);
            setNotificationType(false);
            client.send(`/app/chat/admin/readReceipt`, {}, "read");
        });
        client.subscribe(`/chat/${userData.username}/typing`, (message) => {
            console.log('Received message:', message.body);
            setTyping(true);
        });
        client.subscribe(`/chat/${userData.username}/stoppedTyping`, (message) => {
            console.log('Received message:', message.body);
            setTyping(false);
        });
        client.subscribe(`/chat/${userData.username}/readReceipt`, (message) => {
            console.log('Received message:', message.body);
            setNotificationType(true);
            setNotification('Read');
        });
        client!.send(`/app/chat/admin/readReceipt`, {}, "read");
        setClient(client);

    });
    return () => {
        client.disconnect(() => {
            setClient(null);
            console.log('WebSocket connection closed');
        });
    };
}   , []);

  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  const handleEnergy = (id :string) => {
        return () => {
            navigate(`/energyConsumption/${id}`);
        };

  }

    const sendMessage = () => {
        const newMessage: Message = { message: message,
            sender: userData.username,
            receiver: "Admin",
            timestamp: Date.now(),
            isSent: true};
        // Emit a message event to the server
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        setNotification('Sent');
        setNotificationType(true);

        clientChat!.send(`/app/chat/admin/message`, {}, JSON.stringify(newMessage));
        // Reset the message input field
        setMessage('');
    };

    const handleTyping = () => {
        console.log("Typing...");
        clientChat!.send(`/app/chat/admin/typing`, {}, "typing");
    };

    const handleStoppedTyping = () => {
        console.log("Stopped typing...");
        clientChat!.send(`/app/chat/admin/stoppedTyping`, {}, "stoppedTyping");
    }

  useEffect(() => {
      setList([...deviceWarnings]);
      list.map((item) => { console.log(item.id + " " + item.warning); });
  }, [deviceWarnings]);
  return (
      <DeviceProvider>
      <div className="dashboard-container">
          <div className="welcome-container">
              <h2>
                  {userData ? `Welcome ${userData.username}!` : 'Welcome, Guest!'}
              </h2>
              <p className="welcome-message">These are your devices:</p>
          </div>
          <ul className="object-list">
              {data.map((item) => (
                  <li
                      key={item.id}
                      className={`object-item ${list.reverse().find(device => device.id === item.id)?.warning ? 'warning' : ''}`}
                  >
                      {list.reverse().find(device => device.id === item.id)?.warning  ? (
                          <div>
                              {' '}
                              <span style={{ fontWeight: 'bold' }}>HCE EXCEED: {device.measurementValue}</span>
                          </div>
                      ) : null}
                      <div>
                          <span style={{ fontStyle: 'italic' }}>Description:</span>{' '}
                          <span style={{ fontWeight: 'bold' }}>{item.description}</span>
                      </div>
                      <div>
                          <span style={{ fontStyle: 'italic' }}>Address:</span>{' '}
                          <span style={{ fontWeight: 'bold' }}>{item.address}</span>
                      </div>
                      <div>
                          <span style={{ fontStyle: 'italic' }}>Max Hourly Energy Consumption:</span>{' '}
                          <span style={{ fontWeight: 'bold' }}>{item.maxHourlyEnergyConsumption}</span>
                      </div>

                  </li>
              ))}
          </ul>
          <div className="chat-container">
              <div className="chat-messages">
                  {messages.map((msg, index) => (
                      <div key={index} className={msg.isSent ? 'sent-message' : 'received-message'}>
                          {msg.message}
                      </div>
                  ))}
              </div>
              {typing && <div>Typing...</div>}
              {notificationType && <div style={{ textAlign: 'right' }} >{notification}</div>}
              <div className="chat-input">
                  <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocusCapture={handleTyping}
                      onBlur={handleStoppedTyping}
                  />
                  <button onClick={sendMessage}>Send</button>
              </div>

          </div>
          <div className="button-container">
              <button onClick={handleLogout} className="logout-button">
                  Logout
              </button>
              <button onClick={handleEnergy(userData.username)} className="view-consumption-button">
                  View Device Consumption
              </button>
          </div>
      </div>
</DeviceProvider>
  );

  };
export default Dashboard;