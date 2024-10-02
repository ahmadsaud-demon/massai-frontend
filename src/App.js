import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import ChatBox from './components/ChatBox/ChatBox';
import awsConfig from './aws-exports';
import { Amplify } from 'aws-amplify';

// Configure Amplify *outside* components
Amplify.configure(awsConfig);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatBox />} />
      </Routes>
    </Router>
  );
};

export default App;
