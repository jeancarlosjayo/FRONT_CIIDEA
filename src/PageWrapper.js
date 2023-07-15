import React from 'react';
import { BrowserRouter } from 'react-router-dom';
/* import Preloader from './components/Preloader'; */
import Content from './template/Content';

import Navbar from './template/Navbar';
import Sidebar from './template/Sidebar';
const PageWrapper = ({ setIsLogin }) => {
  return (
    <div className='wrapper'>
      <BrowserRouter>
        <Navbar setIsLogin={setIsLogin} />
        <Sidebar />
        <Content setIsLogin={setIsLogin} />
      </BrowserRouter>
    </div>
  );
};

export default PageWrapper;
