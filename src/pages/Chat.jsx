// pages/dashboard/Chat.js
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import ManagerLayout from '../components/ManagerLayout';

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
    return <ManagerLayout><div className="flex items-center justify-center h-full text-gray-600">Loading chat...</div></ManagerLayout>;
  }
  
  return (
    <ManagerLayout>
      <div className="flex flex-col h-full bg-white rounded-lg shadow">
        <header className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Team Chat</h1>
        </header>
        
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}
        
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Team Members</h3>
              <ul className="space-y-2">
                {onlineUsers.length > 0 ? (
                  onlineUsers.map(onlineUser => (
                    <li key={onlineUser._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {onlineUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">{onlineUser.name}</span>
                        <span className="text-xs text-green-500">Online</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No one online</li>
                )}
              </ul>
            </div>
          </aside>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={message._id || index} 
                    className={`flex flex-col mb-4 ${
                      message.sender._id === user._id ? 'items-end' : 'items-start'
                    }`}
                  >
                    {message.sender._id !== user._id && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs">
                          {message.sender.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{message.sender.name}</span>
                      </div>
                    )}
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender._id === user._id 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs mt-1 block ${
                        message.sender._id === user._id ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default Chat;