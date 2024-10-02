import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import api from '../../services/api';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Function to handle sending a message
  const sendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        await api.post('/ai/generateStream', { message: inputMessage });
        setInputMessage(''); // Clear the input after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    // EventSource to handle the streaming of messages from the backend
    const eventSource = new EventSource('http://localhost:8080/ai/generateStream');

    // Listen for incoming messages
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data); // Parse the data as it's in JSON format
      setMessages((prevMessages) => [...prevMessages, newMessage.message]); // Update the message list
    };

    // Handle errors in the event stream
    eventSource.onerror = (error) => {
      console.error('Error with SSE connection:', error);
      eventSource.close(); // Close the connection if there is an error
    };

    // Cleanup the event source when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="input-message"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
