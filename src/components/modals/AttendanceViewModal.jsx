import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React from 'react';

const AttendanceViewModal = (props) => {
  
        return (
            <div>

              <Dialog
                visible={props.attendanceViewDialog}
                style={{ width: '90vw' }}
                breakpoints={{ '960px': '95vw' }}
                header={props.graduate ? props.graduate.code+' - '+props.graduate.name : ''}
                modal
                className='p-fluid'
                footer={props.attendanceDialogFooter}
                onHide={props.hideDialog}
              >
                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-12 mt-5'>
                    <h6>LISTA DE ASISTENCIA</h6>
                  </div>
                </div>

                <div className='grid p-fluid'>
                  <div style={{'alignItems':'left'}} className='col-12 md:col-12 mt-5'>
                      <DataTable 
                        value={props.lista} 
                        selection={props.usersList} 
                        onSelectionChange={e => props.setUsersList(e.value)} 
                        dataKey="_id" 
                        responsiveLayout="scroll">
                        <Column field="dni" header="DNI"></Column>
                        <Column field="name" header="Nombre"></Column>
                        <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                      </DataTable>

                  </div>
                </div>

              </Dialog>
            </div>
        )
    
};

export default AttendanceViewModal;
