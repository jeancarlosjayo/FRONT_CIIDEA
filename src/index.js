import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const getToken = localStorage.getItem('token');

root.render(
  <React.StrictMode>
    <App getToken={getToken} />
  </React.StrictMode>
);
