import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, {useRef } from 'react';

const GraduateViewModal = (props) => {
  //console.log(props.teacher);
  //console.log(props.students);

  const dt = useRef(null);

    return (
            <div>
              <Dialog
                visible={props.graduateViewDialog}
                style={{ width: '90vw' }}
                breakpoints={{ '960px': '95vw' }}
                header={'Detalle de diplomado'}
                modal
                className='p-fluid'
                footer={props.graduateDialogFooter}
                onHide={props.hideDialog}
              >
                <div className='mb-3'>
                  {props.error && <small className='p-error'>{props.error}</small>}
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-10'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='name'>
                      DIPLOMADO DE {props.graduate.name.toUpperCase()}
                    </label>
                  </div>
                  <div style={{'alignItems':'right'}} className='col-12 md:col-2'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='name'>
                      CÓDIGO: {props.graduate.code.toUpperCase()}
                    </label>
                  </div>
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-2'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='startDate'>
                      FECHA DE INICIO:
                    </label>
                  </div>
                  <div className='col-12 md:col-3'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='startDate'>
                      {props.graduate.startDate}
                    </label>
                  </div>    
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-2'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='endDate'>
                      FECHA DE FIN:
                    </label>
                  </div>
                  <div className='col-12 md:col-3'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='endDate'>
                      {props.graduate.endDate}
                    </label>
                  </div>    
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-10'>
                  </div>
                  <div style={{'alignItems':'right'}} className='col-12 md:col-2'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='name'>
                      DOCENTE: {props.teacher.name}
                    </label>
                  </div>
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-12'>
                    <label 
                      style={{'borderWidth':0}}
                      className='label-modal' 
                      htmlFor='name'>
                      LISTA DE ESTUDIANTES
                    </label>
                  </div>
                </div>
                <div className='grid p-fluid'>
                  <div style={{'alignItems':'center'}} className='col-12 md:col-12'>
                  <DataTable
                  ref={dt}
                  value={props.students}
                  dataKey='id'
                  paginator
                  rows={8}
                  showGridlines
                  stripedRows
                  rowsPerPageOptions={[8, 16, 64]}
                  paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                  currentPageReportTemplate='Mostrando del {first} al {last} de un total de {totalRecords} elementos'
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
                    header='Teléfono'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='username'
                    header='Usuario'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  {
                    /*
                      <Column
                      header='Acciones'
                      body={actionBodyTemplate}
                      exportable={false}
                      style={{ minWidth: '1rem' }}
                    ></Column>
                    */
                  }
                </DataTable>
                  </div>
                </div>

              </Dialog>
            </div>
    );
};

export default GraduateViewModal;
