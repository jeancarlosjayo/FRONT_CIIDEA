import React, { useState, useEffect } from 'react';
import logo from '../assets/logo-graduacion.svg';
import { Link, NavLink } from 'react-router-dom';

import axios from 'axios';
import URI from '../config/Api';

const Sidebar = () => {
  const baseUrl = `${URI}/users`;
  const idUser = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState('');

  const setData = async () => {
    const respuesta = await axios.get(`${baseUrl}/${idUser}`, {
      headers: { Authorization: token },
    });
    setUser(respuesta.data.role);
  };
  useEffect(() => {
    setData();
  });

  let modulesAdmin1 = [
    {
      page: '/admin',
      title: 'Administradores',
      icon: 'users',
    },
    {
      page: '/teacher',
      title: 'Docentes',
      icon: 'users',
    },
    {
      page: '/student',
      title: 'Estudiantes',
      icon: 'users',
    },
  ]
  let modulesAdmin2 = [
   
    {
      page: '/',
      title: 'Diplomados',
      icon: 'briefcase',
    },
    {
      page: '/payment',
      title: 'Pagos',
      icon: 'money-bill',
    },
    {
      page: '/report',
      title: 'Enviar reportes',
      icon: 'file',
    }
  ];
  let modulesStudent = [
    {
      page: '/',
      title: 'Servicios del estudiante',
      icon: 'book',
    },
  ];
  let modulesTeacher = [
   
    {
      page: '/profile',
      title: 'Perfil',
      icon: 'user',
    },
    {
      page: '/asistencia',
      title: 'Asistencia',
      icon: 'eye',
    }
  ];

  return (
    <aside className='main-sidebar sidebar-light-primary elevation-2'>
      {/* Brand Logo */}
      <Link to='/' className='brand-link'>
        <img
          src={logo}
          alt='Logo'
          className='brand-image img-circle elevation-0'
          style={{ opacity: '.8' }}
        />
        <span className='brand-text'>CIIDEA</span>
      </Link>
      {/* Sidebar */}
      <div className='sidebar'>
        {/* Sidebar user panel (optional) */}
        <div className=' mt-3 mb-3 d-flex'></div>
        {/* SidebarSearch Form */}
        <div className='form-inline'></div>
        {/* Sidebar Menu */}
        <nav className='mt-2'>
          <ul
            className='nav nav-pills nav-sidebar flex-column'
            data-widget='treeview'
            role='menu'
            data-accordion='false'
          >
            {user === 'admin' ? (
              <>
                <li className="nav-header"><strong>GESTIÓN DE USUARIOS</strong></li>
                {modulesAdmin1.map((item, index) => (
                  <li className='nav-item' key={index}>
                    <NavLink to={item.page} className='nav-link'>
                      <i className={`nav-icon pi pi-${item.icon}`} />
                      <p>{item.title}</p>
                    </NavLink>
                  </li>
                ))}
                <li className="nav-header"><strong>SERVICIOS</strong></li>
                {modulesAdmin2.map((item, index) => (
                  <li className='nav-item' key={index}>
                    <NavLink to={item.page} className='nav-link'>
                      <i className={`nav-icon pi pi-${item.icon}`} />
                      <p>{item.title}</p>
                    </NavLink>
                  </li>
                ))}
              </>
            ) : user === 'student' ? (
              <>{modulesStudent.map((item, index) => (
                <li className='nav-item' key={index}>
                  <NavLink to={item.page} className='nav-link'>
                    <i className={`nav-icon pi pi-${item.icon}`} />
                    <p>{item.title}</p>
                  </NavLink>
                </li>
              ))}</>
            ) : (
              <>
                {modulesTeacher.map((item, index) => (
                  <li className='nav-item' key={index}>
                    <NavLink to={item.page} className='nav-link'>
                      <i className={`nav-icon pi pi-${item.icon}`} />
                      <p>{item.title}</p>
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default Sidebar;