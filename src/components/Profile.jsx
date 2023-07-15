import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import URI from '../config/Api';

const Profile = ({ setIsLogin }) => {
  const baseUrl = `${URI}/users`;

  const idUser = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState([]);


  useEffect(() => {
    const setData = async () => {
      const respuesta = await axios.get(`${baseUrl}/${idUser}`, {
        headers: { Authorization: token },
      });
      setUser({
        dni: respuesta.data.dni,
        name: respuesta.data.name,
        profession: respuesta.data.profession,
        correo: respuesta.data.email,
        role: respuesta.data.role
      });
    };
    setData();
  }, [baseUrl, idUser, setUser, token]);

  const profile = (
    <div className='text-center pt-4 '>
      <FaUserTie style={{ width: '30%', height: '30%' }} />
    </div>
  );
  const infor = (
    <div className='px-4'>
      <h4 className='mb-5 mt-1'>Datos personales</h4>
      <p>
        <strong>DNI : </strong>
        {user.dni}
      </p>
      <p>
        <strong>Nombre : </strong>
        {user.name}
      </p>
      <p>
        <strong>Profesión : </strong>
        {user.profession}
      </p>
      <p>
        <strong>Correo : </strong>
        {user.correo}
      </p>
    </div>
  );
  return (
    <div>
      {/* Main content */}
      <section className='content mx-1'>
        {/* Default box */}
        <div className='container-fluid'>
          <div className='card'>
            <h2 className='text-bold px-4 mt-3 text-secondary'>
              Información de Usuario
            </h2>
            <div className='row'>
              <div className='col-sm-12 col-md-2 my-4 mx-3'>
                <Card
                  className='bg-secondary'
                  style={{ width: '100%' }}
                  header={profile}
                >
                  <h4 className='text-center'>
                      {user.name} 
                  </h4>
                  <>
                    {
                      user.role === 'admin' ? <h6 className='text-center'>Administrador</h6> : user.role === 'teacher' ? <h6 className='text-center'>Docente</h6> : <h6 className='text-center'>Estudiante</h6>
                    }
                  </>
                    
                </Card>
              </div>
              <div className='col-sm-12 col-md-8 mx-0 mt-4 mb-2'>
                <Card style={{ width: '100%',  }} header={infor}></Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
