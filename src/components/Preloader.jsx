import React from 'react';
import logo from '../assets/logo-dark.svg';
const Preloader = () => {
  return (
    <div>
      {/* Preloader */}
      <div className='preloader flex-column justify-content-center align-items-center'>
        <img
          className='animation__wobble'
          src={logo}
          alt='SativaPharmLogo'
          height={100}
          width={100}
        />
      </div>
    </div>
  );
};

export default Preloader;
