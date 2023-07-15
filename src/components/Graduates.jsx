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
import GraduateViewModal from './modals/GraduateViewModal';
import GraduateModal from './modals/GraduateModal';
import {DateFormat} from '../util/DateFormat';
import Loader from './Loader';

const Graduates = ({ setIsLogin }) => {

  const [isLoading, setIsLoading] = useState(false)
  const baseUrl = `${URL}/graduate`;
  const userUrl = `${URL}/users/graduate/data`;

  let emptyGraduate = {
    code: '',
    name: '',
    starDate: '',
    endDate: '',
    status: '',
    cost:'',
    sessions:''
  };

  const validate = (data) => {

    let errors = {};

    errors.isValidated = false;

    if (!data.name) {
      errors.name = 'Nombre es requerido';
    }

    if (!data.cost) {
      errors.cost = 'Importe es requerido';
    }

    if (!data.startDate) {
        errors.startDate = 'Fecha de inicio es requerido';
    }

    if (!data.endDate) {
      errors.endDate = 'Fecha de fin es requerido';
    }

    if (!data.status) {
      errors.status = 'Fecha de fin es requerido';
    }

    if (!data.sessions) {
      errors.sessions = 'Número de sesiones es requerido';
    }

    if( Object.keys(errors).length === 1 ){
      errors.isValidated = true;
    }

    return errors;
};


  const [datos, setDatos] = useState([]);
  const [graduate, setGraduate] = useState(emptyGraduate);
  const [teacher, setTeacher] = useState([]);
  const [students, setStudents] = useState([]);
  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState('');

  const [globalFilter, setGlobalFilter] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [graduateDialog, setGraduateDialog] = useState(false);
  const [graduateViewDialog, setGraduateViewDialog] = useState(false);

  const toast = useRef(null);
  const dt = useRef(null);

  const statusOptions = [
    { label: 'cancelado', value: 'cancelado' },
    { label: 'en_curso', value: 'en_curso' },
    { label: 'culminado', value:'culminado' },
    { label: 'pendiente', value:'pendiente' }
  ];

  //TODO: Get graduate**
  const cargarDatos = async (token) => {

    setDatos([]);
    setIsLoading(true);
    const respuesta = await axios.get(baseUrl, { headers: { Authorization: token } });
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
    if( name === "startDate" || name === "endDate" ){
        const val = (e.target && e.target.value) || '';
        let _graduate = { ...graduate };
        _graduate[`${name}`] = new DateFormat(val).getStringDate();
        setGraduate(_graduate);
    }else{
        const val = (e.target && e.target.value) || '';
        let _graduate = { ...graduate };
        _graduate[`${name}`] = val;
        setGraduate(_graduate);
    }
  };
  //TODO: Add Graduate**
  const addGraduate = async (e) => {
    setSubmitted(true);
    try {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (token) {
        if(validate(graduate).isValidated){
          
          await axios.post(
            baseUrl,
            { ...graduate },
            { headers: { Authorization: token } }
          );
          
          toast.current.show({
            severity: 'success',
            summary: 'Solicitud exitosa',
            detail: 'Diplomado Creado.',
            life: 3000,
          });
          cargarDatos(token);
          setGraduateDialog(false);
          setGraduate(emptyGraduate);
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
    //console.log("nuevo");
    
    setGraduate(emptyGraduate);
    setEditar(false);
    setSubmitted(false);
    setGraduateDialog(true);
    setGraduateViewDialog(false);
    setError('');
    
  };

  //TODO: Set Data Graduate by Id */
  const setDataGraduate = async (id, index) => {
    const respuesta = await axios.get(`${baseUrl}/${id}`, {
      headers: { Authorization: token },
    });
    setGraduate({
      code: respuesta.data.code,
      name: respuesta.data.name,
      startDate: respuesta.data.startDate,
      endDate: respuesta.data.endDate,
      status: respuesta.data.status,
      cost:respuesta.data.cost,
      sessions:respuesta.data.sessions
    });

    setEditar(true);
    setGraduateDialog(true);
    setGraduateViewDialog(false);
    setIdEditar(id);
    setError('');
  };

  //TODO: View Graduate Details
  const getDetails = async (id,code) => {
    setIsLoading(true);
    const respuesta = await axios.get(`${baseUrl}/${id}`, {
        headers: { Authorization: token },
      });
      setGraduate({
        code: respuesta.data.code,
        name: respuesta.data.name,
        startDate: respuesta.data.startDate,
        endDate: respuesta.data.endDate,
        status: respuesta.data.status,
        cost:respuesta.data.cost,
        sessions:respuesta.data.sessions
      });

      const respuestaTeacher = await axios.get(userUrl, {
        headers: { Authorization: token },
        params:{
          code:code,
          roleType:'teacher'
        }
      });

      if(respuestaTeacher.data.length !== 0){
        setTeacher({   
          name: respuestaTeacher.data[0].name,
        })
      }else{
        setTeacher({   
          name: 'Sin asignar',
        })
      }

      const respuestaStudent = await axios.get(userUrl, {
        headers: { Authorization: token },
        params:{
          code:code,
          roleType:'student'
        }
      });
      setStudents(respuestaStudent.data);
      cargarDatos(token);
      setGraduateDialog(false);
      setGraduateViewDialog(true);
      setIsLoading(false);
  };

  //TODO:Edit Graduate**
  const editGraduate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      if(validate(graduate).isValidated){
        await axios.put(
          `${baseUrl}/${idEditar}`,
          { ...graduate },
          { headers: { Authorization: token } }
        );
        
        toast.current.show({
          severity: 'success',
          summary: 'Solicitud exitosa',
          detail: 'Usuario Editado',
          life: 3000,
        });
        cargarDatos(token);
        setGraduateDialog(false);
        setGraduateViewDialog(false);
        setGraduate(emptyGraduate);
      }
    }
  };
  const hideDialog = () => {
    setGraduateViewDialog(false);
    setGraduateDialog(false);
  };
  //TODO: Delete Graduate**
  const deleteGraduate = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`, {
        headers: { Authorization: token },
      });
      Swal.fire(
        {
          position: 'center',
          title: '¡Eliminado!',
          text: 'El usuario ha sido eliminado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        },
      );
      cargarDatos(token);
      setGraduate(emptyGraduate);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        Swal.fire(
          {
            position: 'center',
            title: '¡Error!',
            text: error.response.data.message,
            icon: 'warning',
            showConfirmButton: true,
          },
        );
      }
   }
  };
  //TODO: Confirm Delete**
  const confirmDeleteGraduate = (id) => {
    Swal.fire({
      title: '¿Desea eliminar este diploma?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#64748B',
      confirmButtonText: '<i class="pi pi-check"></i> Sí',
      cancelButtonText: '<i class="pi pi-times"></i> Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {  deleteGraduate(id)  }
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
            icon='pi pi-eye'
            className='p-button-rounded p-button-info mr-1'
            onClick={() => getDetails(rowData._id,rowData.code)}
          />
          <Button
            icon='pi pi-pencil'
            className='p-button-rounded p-button-primary p-button-sm mr-1'
            onClick={() => setDataGraduate(rowData._id)}
          />
          <Button
            icon='pi pi-trash'
            className='p-button-rounded p-button-danger'
            onClick={() => confirmDeleteGraduate(rowData._id)}
          />
        </div>
      </React.Fragment>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='Nuevo diplomado'
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
  const graduateDialogFooter = (
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
          onClick={editGraduate}
        />
      ) : (
        <Button
          label='Agregar'
          icon='pi pi-check'
          className='p-button'
          onClick={addGraduate}
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
                  value={datos}
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
                    field='code'
                    header='Código'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='name'
                    header='Nombre'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='startDate'
                    header='Inicio'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='endDate'
                    header='Finalización'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='status'
                    header='Estado'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    header='Acciones'
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: '1rem' }}
                  ></Column>
                </DataTable>
                <GraduateModal
                  editar={editar}
                  graduate={graduate}
                  statusOptions={statusOptions}
                  URL={URL}
                  error={error}
                  graduateDialog={graduateDialog}
                  hideDialog={hideDialog}
                  submitted={submitted}
                  onInputChange={onInputChange}
                  graduateDialogFooter={graduateDialogFooter}
                  validate={validate}
                />
                <GraduateViewModal
                    editar={editar}
                    graduate={graduate}
                    teacher={teacher}
                    students={students}
                    statusOptions={statusOptions}
                    URL={URL}
                    error={error}
                    graduateViewDialog={graduateViewDialog}
                    hideDialog={hideDialog}
                    submitted={submitted}
                    onInputChange={onInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
  : appendHtml = (<></>)

  return ( appendHtml );
};

export default Graduates;
