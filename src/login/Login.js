import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import logo from '../assets/logo-graduacion-alt.svg';
import './login.css';
import URI from '../config/Api';
const Login = ({ setIsLogin }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const urlLogin = `${URI}/auth/login`;
      const { data: res } = await axios.post(urlLogin, data);
      localStorage.setItem('token', res.token);
      localStorage.setItem('id', res.id);
      setIsLogin(true);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Autenticación no exitosa',
          text: error.response.data.message,
        });
      }
    }
  };
  return (
    <div className='body-login'>
      <Card className='card-login'>
        <div className='logo-login'>
          <img src={logo} alt='' />
        </div>
        <h2 className='title-login'>Bienvenido a CIIDEA</h2>
        <div className='subtitle-login'>
          <span></span>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Nombre de usuario</label>
          <div>
            <InputText
              autoComplete='off'
              type='username'
              name='username'
              value={data.username || ''}
              className='input-login'
              onChange={(e) => handleChange(e)}
              placeholder='Ingrese su usuario'
              required
            />
          </div>
          <label>Contraseña</label>
          <div>
            <Password
              autoComplete='off'
              type='password'
              name='password'
              value={data.password || ''}
              className='input-login'
              onChange={(e) => handleChange(e)}
              placeholder='Ingrese su contraseña'
              feedback={false}
              toggleMask
              required
            />
          </div>
          <Button type='submit' label='Ingresar' className='btn-login' />
        </form>
      </Card>
    </div>
  );
};

export default Login;
