import React, { useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import Notfound from '../components/Notfound';
import Profile from '../components/Profile';
import Attendance from '../components/Attendance';
import URI from '../config/Api';
import axios from 'axios';
import Preloader from './Preloader';
import Admins from '../components/Admins';
import Teachers from '../components/Teachers';
import Students from '../components/Students';
import Report from '../components/Report';
import Graduates from '../components/Graduates';
import Payments from '../components/Payments';
import StudentHome from '../components/StudentHome';
import TeacherHome from '../components/TeacherHome';
import Evidence from '../components/Evidence'

const Content = ({ setIsLogin }) => {
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

  let routes = [
    {
      path: '/',
      element: <Graduates setIsLogin={setIsLogin} />,
    },
    {
      path: '/report',
      element: <Report setIsLogin={setIsLogin} />,
    },
    {
      path: '/payment',
      element: <Payments setIsLogin={setIsLogin} />,
    },
    {
      path: '/evidence',
      element: <Evidence setIsLogin={setIsLogin} />,
    },
    {
      path: '/admin',
      element: <Admins setIsLogin={setIsLogin} />,
    },
    {
      path: '/teacher',
      element: <Teachers setIsLogin={setIsLogin} />,
    },
    {
      path: '/student',
      element: <Students setIsLogin={setIsLogin} />,
    },
    {
      path: '/profile',
      element: <Profile setIsLogin={setIsLogin} />,
    },
    {
      path: '*',
      element: <Notfound setIsLogin={setIsLogin} />,
    }
  ];
  let routesStudent = [
    {
      path: '/',
      element: <StudentHome setIsLogin={setIsLogin} />,
    },
    {
      path: '/profile',
      element: <Profile setIsLogin={setIsLogin} />,
    }
  ];
  let routesTeacher = [
    {
      path: '/',
      element: <TeacherHome setIsLogin={setIsLogin} />,
    },
    {
      path: '/profile',
      element: <Profile setIsLogin={setIsLogin} />,
    },
    {
      path: '/asistencia',
      element: <Attendance setIsLogin={setIsLogin} />,
    }
  ];
  let admin = useRoutes(routes);
  let student = useRoutes(routesStudent);
  let teacher = useRoutes(routesTeacher);

  return (
    <div className='content-wrapper'>
      {user === '' ? <Preloader /> : <>{user === 'admin' ? admin : user === 'student' ? student : teacher}</>}
    </div>
  );
};

export default Content;
