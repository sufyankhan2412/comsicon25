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
      <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h1 className="text-2xl font-bold text-gray-800">Team Chat</h1>
        </header>
        {error && <div className="p-4 text-red-600 bg-red-50">{error}</div>}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-100 bg-gray-50 p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-600 mb-4">Team Members</h3>
              <ul className="space-y-3">
                {onlineUsers.length > 0 ? (
                  onlineUsers.map(onlineUser => (
                    <li key={onlineUser._id} className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {onlineUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">{onlineUser.name}</span>
                        <span className="text-xs text-green-500 ml-2">● Online</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400 italic">No one online</li>
                )}
              </ul>
            </div>
          </aside>
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={message._id || index} 
                    className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[60%] px-5 py-3 rounded-2xl shadow-md break-words ${
                      message.sender._id === user._id 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}>
                      {message.sender._id !== user._id && (
                        <div className="flex items-center mb-1">
                          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {message.sender.name.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{message.sender.name}</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs mt-1 block text-right ${
                        message.sender._id === user._id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 h-12 rounded-full border border-blue-300 px-5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 text-gray-800 shadow-sm"
                />
                <button 
                  type="submit" 
                  className="flex items-center gap-2 w-auto h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 p-0"
                >
                  <i className="fas fa-paper-plane text-lg"></i>
                  <span>Send</span>
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