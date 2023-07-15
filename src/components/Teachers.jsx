import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import URL from '../config/Api';
import TeacherModal from './modals/TeacherModal';
import Loader from './Loader';

const Teachers = ({ setIsLogin }) => {

  const [isLoading, setIsLoading] = useState(false)

  const baseUrl = `${URL}/users`;
  let emptyUser = {
    dni: '',
    name: '',
    phone: '',
    email: '',
    profession: '',
    username: '',
    password: '',
    role: 'teacher',
    graduate: [],
  };
  const [datos, setDatos] = useState([]);
  const [user, setUser] = useState(emptyUser);
  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState('');

  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  const validate = (data) => {
    let errors = {};

    errors.isValidated = false;

    if (!data.dni) {
      errors.dni = 'DNI es requerido.';
    } else if (data.dni.length < 8) {
      errors.dni = 'DNI no puede ser menor a 8.';
    }

    if (!data.name) {
      errors.name = 'Nombre es requerido';
    }

    if (!data.phone) {
      errors.phone = 'Celular es requerido';
    } else if (data.phone.length < 9) {
      errors.phone = 'Celular no puede ser menor a 9.';
    }

    if (!data.email) {
      errors.email = 'Correo es requerido';
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = 'Correo invalido. Ejemplo: example@domain.com';
    }

    if (!data.username) {
      errors.username = 'Usuario es requerido';
    }

    if (!data.profession) {
      errors.profession = 'Especialidad es requerida.';
    }

    if (!data.password) {
      errors.password = 'Contraseña es requerida.';
    }


    if (Object.keys(errors).length === 1) {
      errors.isValidated = true;
    }

    return errors;
  };


  //TODO: Get users**
  const cargarDatos = async (token) => {

    setDatos([]);
    setIsLoading(true);

    const respuesta = await axios.get(baseUrl, {
      headers: { Authorization: token },
    });
    setDatos(respuesta.data);
    setIsLoading(false);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) {
      setIsLoading(true);
      cargarDatos(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
  };
  //TODO: Add User**
  const addUser = async (e) => {
    setSubmitted(true);
    try {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (token) {
        if (validate(user).isValidated) {
          await axios.post(
            baseUrl,
            { ...user },
            { headers: { Authorization: token } }
          );
          toast.current.show({
            severity: 'success',
            summary: 'Solicitud exitosa',
            detail: 'Usuario Creado.',
            life: 3000,
          });
          cargarDatos(token);
          setUserDialog(false);
          setUser(emptyUser);
          setSubmitted(false);
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  const openNew = () => {
    setUser(emptyUser);
    setEditar(false);
    setSubmitted(false);
    setUserDialog(true);
    setError('');
  };
  //TODO: Set Data User by Id */
  const setDataUser = async (id, index) => {
    const respuesta = await axios.get(`${baseUrl}/${id}`, {
      headers: { Authorization: token },
    });
    setUser({
      dni: respuesta.data.dni,
      name: respuesta.data.name,
      phone: respuesta.data.phone,
      username: respuesta.data.username,
      profession: respuesta.data.profession,
      email: respuesta.data.email,
      password: respuesta.data.password,
      graduate: respuesta.data.graduate
    });
    setEditar(true);
    setUserDialog(true);
    setIdEditar(id);
    setError('');
  };

  //TODO:Edit User**
  const editUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      if (validate(user).isValidated) {
        await axios.put(
          `${baseUrl}/${idEditar}`,
          { ...user },
          { headers: { Authorization: token } }
        );
        toast.current.show({
          severity: 'success',
          summary: 'Solicitud exitosa',
          detail: 'Usuario Editado',
          life: 3000,
        });
        cargarDatos(token);
        setUserDialog(false);
        setUser(emptyUser);
      }
    }
  };
  const hideDialog = () => {
    setUserDialog(false);
  };
  //TODO: Delete User**
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: token },
      });
      cargarDatos(token);
      setUser(emptyUser);
    } catch (error) {
      window.location.href = '/';
    }
  };
  //TODO: Confirm Delete**
  const confirmDeleteUser = (id) => {
    Swal.fire({
      title: '¿Desea eliminar este usuario?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#64748B',
      confirmButtonText: '<i class="pi pi-check"></i> Sí',
      cancelButtonText: '<i class="pi pi-times"></i> Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          {
            position: 'center',
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          },
          deleteUser(id)
        );
      }
    });
  };

  const header = (
    <div className='table-header'>
      <h5 className='mx-0 my-1'>{''}</h5>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder='Buscar...'
        />
      </span>
    </div>
  );
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <Button
            icon='pi pi-pencil'
            className='p-button-rounded p-button-primary p-button-sm mr-1'
            onClick={() => setDataUser(rowData._id)}
          />
          <Button
            icon='pi pi-trash'
            className='p-button-rounded p-button-danger'
            onClick={() => confirmDeleteUser(rowData._id)}
          />
        </div>
      </React.Fragment>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='Registrar docente'
          icon='pi pi-plus'
          className='p-button-sm m-auto'
          onClick={openNew}
        />
        <Button
          label='Refrescar'
          icon='pi pi-refresh'
          className='p-button-sm m-auto'
          onClick={cargarDatos}
        />
      </React.Fragment>
    );
  };
  const userDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        className='p-button-outlined p-button-secondary'
        onClick={hideDialog}
      />
      {editar ? (
        <Button
          label='Actualizar'
          icon='pi pi-check'
          className='p-button'
          onClick={editUser}
        />
      ) : (
        <Button
          label='Agregar'
          icon='pi pi-check'
          className='p-button'
          onClick={addUser}
        />
      )}
    </React.Fragment>
  );

  let appendHtml = "";

  datos ? 
  appendHtml = (
    <div>
        {/* Loader */ }
        < Loader isLoading = { isLoading } />
        {/* Main content */}
        <section className='content mx-1'>
          {/* Default box */}
          <div className='container-fluid'>
            <div className='card'>
              <div className='card-body'>
                <div className='datatable-crud-demo'>
                  <Toast ref={toast} position='bottom-right' />
                  {/* <div className='card'> */}
                  <Toolbar className='mb-3' left={leftToolbarTemplate}></Toolbar>
                  <DataTable
                    ref={dt}
                    value={datos.filter(f => f.role === 'teacher')}
                    dataKey='id'
                    paginator
                    rows={8}
                    showGridlines
                    stripedRows
                    rowsPerPageOptions={[8, 16, 64]}
                    paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                    currentPageReportTemplate='Mostrando del {first} al {last} de un total de {totalRecords} elementos'
                    globalFilter={globalFilter}
                    header={header}
                    className='datastyle'
                    emptyMessage='No se encontraron usuarios.'
                    responsiveLayout='stack'
                    breakpoint='960px'
                    size='small'
                  >
                    <Column
                      field='dni'
                      header='DNI'
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    <Column
                      field='name'
                      header='Nombre'
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    <Column
                      field='phone'
                      header='Celular'
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    <Column
                      field='email'
                      header='Correo'
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    <Column
                      field='profession'
                      header='Especialidad'
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    <Column
                      header='Acciones'
                      body={actionBodyTemplate}
                      exportable={false}
                      style={{ minWidth: '1rem' }}
                    ></Column>
                  </DataTable>
                  <TeacherModal
                    editar={editar}
                    user={user}
                    URL={URL}
                    error={error}
                    userDialog={userDialog}
                    hideDialog={hideDialog}
                    submitted={submitted}
                    onInputChange={onInputChange}
                    userDialogFooter={userDialogFooter}
                    validate={validate}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  ) : appendHtml = ( <>Cargando...</> )

  return ( appendHtml );
};

export default Teachers;
