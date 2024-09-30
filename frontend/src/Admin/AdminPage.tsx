import React, {useRef, useState} from 'react';
import UserList from './Lists/UsersList';
import DeviceList from './Lists/DevicesList';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminPage.css"
import AddUser from './Adders/AddUser';
import AddDevice from './Adders/AddDevice';
import {UserProvider, useUser} from '../Context/UserContext';
import {DeviceProvider, useDevice} from '../Context/DeviceContext';
import SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";

const AdminPage = () => {

    interface Message {
        message : string;
        sender: string;
        receiver: string;
        timestamp : number;
        isSent: boolean;
    }

    const userDataJSON = sessionStorage.getItem('userData');
    const userData = userDataJSON ? JSON.parse(userDataJSON) : null;
    const {userList} = useUser();
    const navigate = useNavigate();
    const {device, clientChat}    = useDevice();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(''); // To keep track of the active chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [notification, setNotification] = useState('');
    const [notificationType, setNotificationType] = useState(false);
    const [clientChat1, setClient] = useState<CompatClient | null>(null);
    useEffect(() => {
        if(userData === null || userData.role !== 'ADMIN') {
          navigate("/");
        }
      }, []);

    useEffect(() => {

            const ws = new SockJS('http://localhost:8085/chatWS');
            const clientChat2 = Stomp.over(ws);
            ws.onopen = () => {
                setOpen(true);
                console.log('WebSocket connection established');
            };
            console.log("clientChat is null");
            setClient(clientChat2);
            clientChat2!.connect({}, () => {
                console.log('Stomp client connected');
                // Subscription and message sending here
                clientChat2!.subscribe(`/chat/admin/message`, (message) => {
                    var jsonMesssage = JSON.parse(message.body);
                    console.log("Message json is ", jsonMesssage);
                    setMessages((prevMessages) => [...prevMessages, {...jsonMesssage, isSent: false}]);
                    setNotificationType(false);
                    setNotification('');
                    handleNotification(jsonMesssage.sender, clientChat2);
                });
                clientChat2!.subscribe(`/chat/admin/typing`, (message) => {
                    console.log('Received message:', message.body);
                    setTyping(true);
                });
                clientChat2!.subscribe(`/chat/admin/stoppedTyping`, (message) => {
                    console.log('Received message:', message.body);
                    setTyping(false);
                });
                clientChat2!.subscribe(`/chat/admin/readReceipt`, (message) => {
                    console.log('Received message:', message.body);

                        setNotification('Read');
                        setNotificationType(true);
                });
            });
            setClient(clientChat2);
            return () => {
                clientChat2!.disconnect(() => {
                    setClient(null);
                    console.log('WebSocket connection closed');
                });
            };

    }   , []);


    const activeTabRef = useRef(activeTab);

    const handleNotification = (sender: string, client: CompatClient) => {
        console.log("active tab is " + activeTabRef.current);
        console.log("sender is " + sender);

        if (activeTabRef.current === sender) {
            console.log("a" + clientChat1 === null);

            client!.send(`/app/chat/${sender}/readReceipt`, {}, "read");
        }
    };
    const switchChat = (userId: string) => {
        setActiveTab(userId);
        clientChat1!.send(`/app/chat/${userId}/readReceipt`, {}, "read");
    };

    useEffect(() => {
        activeTabRef.current = activeTab; // Update the ref whenever activeTab changes
    }, [activeTab]);

    const sendMessage = () => {
        if (!activeTab) {
            console.log("cox");
            return;
        }
        console.log(activeTab);

        const newMessage: Message = { message: message,
            sender: "Admin",
            receiver: activeTab,
            timestamp: Date.now(),
            isSent: true};
        // Emit a message event to the server

        console.log(messages);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(messages);

        setNotification('Sent');
        setNotificationType(true);

        clientChat1!.send(`/app/chat/${activeTab}/message`, {}, JSON.stringify(newMessage));
        // Reset the message input field
        setMessage('');
    };

    const handleTyping = () => {
        clientChat1!.send(`/app/chat/${activeTab}/typing`, {}, "typing");
    };

    const handleStoppedTyping = () => {
        clientChat1!.send(`/app/chat/${activeTab}/stoppedTyping`, {}, "stopped typing");
    }


      const handleLogout = () => {
    sessionStorage.removeItem('userData');
          sessionStorage.removeItem('token');
          navigate('/');
  };


      useEffect(() => {
          console.log("device " + device.deviceId);
      } , [device]);


    const filteredUserList = userList.filter(user => !user.role.includes("ADMIN"));
  return (
      <DeviceProvider>
    <div className="admin-container">
      <div className="admin-content">
      <div className="admin-list">
        <AddUser />
      </div>
      <div className="admin-list">
        <AddDevice />
      </div>
      </div>
      <div className="admin-content">
        <div className="admin-list">
          <UserList />
        </div>
        <div className="admin-list">
          <DeviceList />
        </div>
      </div>
        <div className="chat-tabs">
            {/* Render a tab for each user */}
            {filteredUserList.map((user) => (
                <div
                    key={user.username}
                    onClick={() => switchChat(user.username)}
                    className={`chat-tab ${activeTab === user.username ? 'active-tab' : ''}`}
                >
                    {user.username}
                </div>
            ))}
        </div>
        <div className="chat-container">
            <div className="chat-messages">
                {messages
                    .filter((msg) => msg.sender === activeTab || msg.receiver === activeTab)
                    .map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.isSent ? 'sent-message' : 'received-message'}`}
                        >
                            {msg.message}
                        </div>
                    ))}
            </div>
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
            {typing && <div className="typing-notification">Typing...</div>}
            {notificationType && <div className="notification">{notification}</div>}
        </div>
      <div className="logout-button-container">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
    </DeviceProvider>
  );
};

export default AdminPage;