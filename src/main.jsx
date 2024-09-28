import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { app } from './firebase/firebase.app.js';
import App from './App.jsx';
import Login from './routes/Login.jsx';
import Signup from './routes/Signup.jsx';
import Anonymous from './routes/Anonymous.jsx';
import Guard from './routes/Guard/Guard.jsx';
import Chats from './routes/Chats.jsx';
import Notification from './routes/Notification.jsx';
import Peoples from './routes/Peoples.jsx';
import Message from './routes/message/Message.jsx';
import './styles/main.css';

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/anonymous" element={<Anonymous />} />

        {/* Private Route to protect the App */}
        <Route path="/message/:id" element={<Guard><Message /></Guard>} /> {/* Capture the ID from the URL */}
        <Route path="/" element={<Guard><App /></Guard>}>
          <Route path="chats" element={<Chats />} /> 
          <Route path="notification" element={<Notification />} />
          <Route path="peoples" element={<Peoples />} />
        </Route>

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>
);


