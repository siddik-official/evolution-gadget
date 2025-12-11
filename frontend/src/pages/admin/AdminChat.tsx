import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Send, Search, User, Circle } from 'lucide-react';

interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const AdminChat: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const chatUsers: ChatUser[] = [
    { id: '1', name: 'John Doe', lastMessage: 'When will my order arrive?', time: '2m ago', unread: 2, online: true },
    { id: '2', name: 'Jane Smith', lastMessage: 'Thank you for the help!', time: '15m ago', unread: 0, online: false },
    { id: '3', name: 'Mike Johnson', lastMessage: 'Is this product in stock?', time: '1h ago', unread: 1, online: true },
    { id: '4', name: 'Sarah Williams', lastMessage: 'I need a refund', time: '2h ago', unread: 3, online: false },
    { id: '5', name: 'Tom Brown', lastMessage: 'Great service!', time: '5h ago', unread: 0, online: false },
  ];

  const messages = selectedUser ? [
    { sender: 'customer', text: 'Hello! I have a question about my order', time: '10:30 AM' },
    { sender: 'admin', text: 'Hi! I\'d be happy to help. What\'s your order number?', time: '10:31 AM' },
    { sender: 'customer', text: 'It\'s #ORD-001', time: '10:32 AM' },
    { sender: 'admin', text: 'Let me check that for you...', time: '10:32 AM' },
    { sender: 'customer', text: selectedUser.lastMessage, time: '10:35 AM' },
  ] : [];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle message sending
      setMessage('');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Chat System</h1>
            <p>Communicate with customers</p>
          </div>
        </div>

        <div className="admin-chat-container">
          {/* Chat Users List */}
          <div className="admin-chat-sidebar">
            <div className="admin-chat-search">
              <Search size={20} />
              <input type="text" placeholder="Search conversations..." />
            </div>
            
            <div className="admin-chat-users">
              {chatUsers.map((user) => (
                <div
                  key={user.id}
                  className={`admin-chat-user ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="admin-chat-user-avatar">
                    <User size={20} />
                    {user.online && <Circle className="admin-chat-user-status" size={10} />}
                  </div>
                  <div className="admin-chat-user-info">
                    <div className="admin-chat-user-header">
                      <h4>{user.name}</h4>
                      <span className="admin-chat-time">{user.time}</span>
                    </div>
                    <p>{user.lastMessage}</p>
                  </div>
                  {user.unread > 0 && (
                    <span className="admin-chat-unread">{user.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="admin-chat-main">
            {selectedUser ? (
              <>
                <div className="admin-chat-header">
                  <div className="admin-chat-user-avatar">
                    <User size={20} />
                    {selectedUser.online && <Circle className="admin-chat-user-status" size={10} />}
                  </div>
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <p>{selectedUser.online ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="admin-chat-messages">
                  {messages.map((msg, index) => (
                    <div key={index} className={`admin-chat-message ${msg.sender}`}>
                      <div className="admin-chat-message-bubble">
                        <p>{msg.text}</p>
                        <span className="admin-chat-message-time">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="admin-chat-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="admin-btn-primary">
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="admin-chat-empty">
                <User size={64} />
                <h3>Select a conversation</h3>
                <p>Choose a customer from the list to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminChat;
