// pages/dashboard/Chat.js
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import "./Dashboard.css"

const Chat = () => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  // Setup socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Handle socket events
  useEffect(() => {
    if (!socket || !user) return;
    
    // Join chat
    socket.emit('join', user._id);
    
    // Listen for new messages
    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    // Listen for online users updates
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });
    
    // Listen for socket errors
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError('Connection error. Please refresh the page.');
    });
    
  }, [socket, user]);
  
  // Fetch existing messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:5000/api/messages', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data);
        
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchMessages();
    }
  }, [token]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Send message via socket
    if (socket) {
      socket.emit('chatMessage', {
        token,
        content: messageInput
      });
      
      // Reset input field
      setMessageInput('');
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return <div className="loading">Loading chat...</div>;
  }
  
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Team Chat</h1>
      </header>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="chat-main">
        <aside className="chat-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Team Members</h3>
            <ul className="users-list">
              {onlineUsers.length > 0 ? (
                onlineUsers.map(onlineUser => (
                  <li key={onlineUser._id} className="user-item">
                    <div className="user-avatar">
                      {onlineUser.name.charAt(0)}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{onlineUser.name}</span>
                      <span className="user-status online">Online</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-users">No one online</li>
              )}
            </ul>
          </div>
        </aside>
        
        <div className="chat-messages-container">
          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={message._id || index} 
                  className={`message ${message.sender._id === user._id ? 'message-own' : 'message-other'}`}
                >
                  {message.sender._id !== user._id && (
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {message.sender.name.charAt(0)}
                      </div>
                      <span className="sender-name">{message.sender.name}</span>
                    </div>
                  )}
                  <div className="message-content">
                    <p>{message.content}</p>
                    <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;