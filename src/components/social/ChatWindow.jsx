// src/components/Social/ChatWindow.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import socialApi from "../../api/socialApi";
import MessageInput from "./MessageInput";

const ChatWindow = ({ user1Id, user2Id }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await socialApi.getChat({ user1: user1Id, user2: user2Id });
      setMessages(data.messages || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch chat error:", err);
      setLoading(false);
    }
  };

  const handleSend = async (text) => {
    try {
      const newMsg = await socialApi.sendMessage({ sender: user1Id, receiver: user2Id, text });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Optional: Polling every 5s for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user1Id, user2Id]);

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className="flex flex-col h-full border rounded p-2 bg-white shadow">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender === user1Id ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
            } max-w-xs`}
          >
            <span>{msg.text}</span>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;

ChatWindow.propTypes = {
  user1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  user2Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
