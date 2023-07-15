import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageWrapper from './PageWrapper';
import Login from './login/Login';
import URI from './config/Api';

const App = ({ getToken }) => {
  const [isLogin, setIsLogin] = useState(getToken);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const checkLogin = async () => {
      if (token) {
        const verified = await axios.get(`${URI}/auth/verify`, {
          headers: { Authorization: token, Accept: id },
        });
        setIsLogin(verified.data);
        if (verified.data === false) return localStorage.clear();
      } else {
        setIsLogin(false);
      }
    };
    checkLogin();
  }, [token, id]);
  return (
    <>
      {isLogin ? (
        <PageWrapper setIsLogin={setIsLogin} />
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </>
  );
};

export default App;
