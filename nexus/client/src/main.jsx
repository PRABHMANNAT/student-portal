import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AppProvider } from './context/AppContext';
import { ChatProvider } from './context/ChatContext';
import { ProfileProvider } from './context/ProfileContext';
import './index.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/app.css';
import './styles/profile-editor.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ProfileProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ProfileProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
