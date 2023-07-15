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
import {DateFormat} from '../util/DateFormat';
import AttendanceViewModal from './modals/AttendanceViewModal';


const Attendance = ({ setIsLogin }) => {

  const baseUrl = `${URL}/attendance`;
  const baseUserUrl = `${URL}/users`;

  const [datos, setDatos] = useState([]);
  const [users, setUsers] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [usersList,setUsersList] = useState([]);
  const [lista,setLista] = useState([]);
  const [today, setToday] = useState( new DateFormat(new Date()) );
  const [attendance, setAttendance] = useState([]);
  const [graduate, setGraduate] = useState(null);
  const [userAttendance, setUserAttendance] =useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('id'));
  const [students, setStudents] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [attendanceViewDialog, setAttendanceViewDialog] = useState(false);
  const [attendanceId,setAttendanceId] = useState();
  const toast = useRef(null);
  const dt = useRef(null);

  //TODO: Get graduate**
  const cargarDatos = async (token) => {

    

    const users = await axios.get(baseUserUrl, {
      headers: { Authorization: token },
    });

    const respuesta = await axios.get(baseUrl, {
      headers: { Authorization: token },
    });

    const teacher = await axios.get(`${baseUserUrl}/${userId}`, {
      headers: { Authorization: token },
    });

    teacher.data.graduate.forEach((item)=>{
      let found = respuesta.data.filter( o => o.graduate === item._id && o.fechaAsistencia === today.getFormatDate2() );
      item.attendance = found;
      if(found.length>0){
        item.isAttendance  = true;
        item.attendanceStatus = 'Marcado';
      }else{
        item.isAttendance  = false;
        item.attendanceStatus = 'Pendiente'
      }
    })

    setUsers(users.data.filter(o=>o.role === 'student'));
    setDatos(respuesta.data);
    setTeacher(teacher.data);

    setLoading1(false);
    setLoading2(false);
    setLoading(false);

  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    if (token) { cargarDatos(token) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAttendance = async (row) => {
    const respuestaStudents = await axios.get(`${baseUserUrl}/graduate/data`, {
      headers: { Authorization: token },
      params:{
        code:row.code,
        roleType:'student'
      }
    });

    respuestaStudents.data.forEach((usuario)=>{
      const find = row.attendance[0].listStudents.map((userId)=>{ return users.find(o=>o._id ===  userId)._id })
            .find( id => id === usuario._id );
      if(find !== undefined){
          usuario.isVisible = true
      }else{
          usuario.isVisible = false
      }
  })

    cargarDatos(token);
    setAttendanceId(row.attendance[0]._id);
    setUsersList(respuestaStudents.data.filter( o=> o.isVisible === true));
    setLista(respuestaStudents.data);
    setAttendanceViewDialog(true);
    setGraduate(row);
  }



  const getDetails = async (id,code) => {
    setLoading2(true);
    const respuestaStudent = await axios.get(`${baseUserUrl}/graduate/data`, {
      headers: { Authorization: token },
      params:{
        code:code,
        roleType:'student'
      }
    });

    if(respuestaStudent.data.length === 0){
      Swal.fire(
        {
          position: 'center',
          title: 'Sección sin alumos',
          icon: 'warning',
          showConfirmButton: true
        },
      )
    }else{
      Swal.fire({
        title: '¿Desea generar la asistencia para esta sección?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6366F1',
        cancelButtonColor: '#64748B',
        confirmButtonText: '<i class="pi pi-check"></i> Sí',
        cancelButtonText: '<i class="pi pi-times"></i> Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {  

          createAttendance(
            {
              listStudents : respuestaStudent.data.map((item)=>{return item._id}),
              graduate     : id,
              fechaAsistencia: today.getStringDate(),
              statusAttendance: false
            }
          );
          
        }
      }).then(() => {
        cargarDatos(token);
        toast.current.show({
          severity: 'success',
          summary: 'Solicitud exitosa',
          detail: 'Asistencia generada.',
          life: 3000,
        });
      }).then(() => {
        cargarDatos(token);
      })
    }
  }

  const createAttendance = async (request) => {
    setLoading2(true);

    await axios.post(
      baseUrl,
      { ...request },
      { headers: { Authorization: token } }
    );
  }

  const updateAttendance = async () => {
    setLoading1(true);
    const request = {
      listStudents : usersList.map((item)=>{return item._id}),
      graduate     : graduate._id,
      fechaAsistencia: today.getStringDate(),
    }

    await axios.put(
      `${baseUrl}/${attendanceId}`,
      { ...request},
      { headers: { Authorization: token } }
    )

    hideDialog();

    toast.current.show({
      severity: 'success',
      detail: 'Asistencia guardada.',
      life: 3000,
    });

    cargarDatos(token);

  }

  const attendanceDialogFooter = (
    <div style={{textAlign:"center"}}>
      <React.Fragment>
        <Button
            label='Guardar'
            icon='pi pi-check'
            className='p-button'
            onClick={updateAttendance}
          />
      </React.Fragment>
    </div>
  );


  const header = (
    <div className='table-header'>
      <h5 className='mx-0 my-1'>Asistencia: {today.getFormatDate3()}</h5>
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

  const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _attendance = { ...attendance };
        _attendance[`${name}`] = val;
        setAttendance(_attendance);
  };

  const hideDialog = () => {
    setAttendanceViewDialog(false);
  };

  const actionBodyTemplate = (rowData) => {
    let template = '';
    rowData.isAttendance ? 
    template = (
      <Button
        loading={loading1} 
        label='Editar'
        icon='pi pi-pencil'
        className='p-button-rounded p-button-info'
        onClick={() => showAttendance(rowData)}
      />
    ) : 
    template = (
      <Button
      loading={loading2} 
        label='Generar'
        icon='pi pi-flag'
        className='p-button-rounded p-button-warning'
        onClick={() => getDetails(rowData._id,rowData.code)}
      />
    )

    return (
      <React.Fragment>
        <div>
        {template}
        </div>
      </React.Fragment>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        
        <Button
          label='Refrescar'
          icon='pi pi-refresh'
          className='p-button-sm'
          onClick={cargarDatos}
        />

      </React.Fragment>
    );
  };


  return (
    <div>
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
                  value={teacher.graduate}
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
                    header='Código de diplomado'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column 
                    field='name'
                    header='Nombre'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='attendanceStatus'
                    header='Estado'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    header='Acción'
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: '1rem' }}
                  ></Column>
                </DataTable>
                <AttendanceViewModal
                    usersList={usersList}
                    lista={lista}
                    setUsersList={setUsersList}
                    graduate={graduate}
                    teacher={teacher}
                    attendanceViewDialog={attendanceViewDialog}
                    hideDialog={hideDialog}
                    onInputChange={onInputChange}
                    attendanceDialogFooter={attendanceDialogFooter}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attendance;
