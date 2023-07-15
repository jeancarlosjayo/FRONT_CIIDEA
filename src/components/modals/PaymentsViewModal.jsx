import { Dialog } from 'primereact/dialog';
import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const PaymentsViewModal = (props) => {

  const dt = useRef(null);
  
  if(Object.entries(props.payment).length !== 0){

    const quote    = props.payment.quote;
    const student  = props.payment.student;
    const graduate = props.payment.graduate;
    
    return (
      <>
        <Dialog
          visible={props.paymentDialog}
          style={{ width: '70vw' }}
          breakpoints={{ '960px': '95vw' }}
          header={'CUOTAS - '+graduate.name.toUpperCase()}
          modal
          className='p-fluid'
          footer={props.paymentDialogFooter}
          onHide={props.hidePaymentDialog}
        >
          <div className='grid p-fluid mt-5'>
              <div className='col-12 md:col-6'>
                <h6>DNI   : {student.dni}</h6>
                <h6>ESTUDIANTE  : {student.name.toUpperCase()}</h6>

              </div>
              <div className='col-12 md:col-4'></div> 
              <div className='col-12 md:col-2'>
                <Button
                  label='Nueva cuota'
                  className='p-button'
                  onClick={props.newQuoteDialog}
                />
              </div>
          </div>
          <div className='grid p-fluid mt-2'>
            <div className='col-12 md:col-12'>
                 
              <DataTable
                  sortOrder={1}
                  sortField="numCuota"
                  border='false'
                  ref={dt}
                  value={quote}
                  dataKey='id'
                  showGridlines
                  stripedRows
                  className='datastyle mt-5'
                  emptyMessage='No hay cuotas generadas.'
                  responsiveLayout='stack'
                  breakpoint='960px'
                  size='small'
                >
                  <Column
                    sortable 
                    field='numCuota'
                    header='CUOTA'
                    style={{ minWidth: '1rem' }}
                  />
                  <Column
                    sortable
                    field='importeCuota'
                    header='IMPORTE'
                    style={{ minWidth: '1rem' }}
                  />
                  <Column
                  sortable 
                    field='fecVencCuota'
                    header='FECHA VENCIMIENTO'
                    style={{ minWidth: '1rem' }}
                  />
                  <Column
                    field='fecPagoCuota'
                    header='FECHA PAGO'
                    style={{ minWidth: '1rem' }}
                  />
                  <Column
                    field='status'
                    header='ESTADO'
                    style={{ minWidth: '1rem' }}
                  />
                  <Column
                    header='ACCIONES'
                    body={props.actionBodyTemplateQuotes}
                    exportable={false}
                    style={{ minWidth: '1rem' }}
                  ></Column>
                </DataTable>
            </div>
          </div>
          <div className='grid p-fluid mt-2'>
            <div className='col-12 md:col-6'>
              <h6>
                TOTAL
              </h6>
            </div>
            <div className='col-12 md:col-6'>
              <h6>
                {props.payment.importePagado}
              </h6>
            </div>
          </div>
          <div className='grid p-fluid mt-2'>
            <div className='col-12 md:col-6'>
              <h6>
                DEUDA TOTAL
              </h6>
            </div>
            <div className='col-12 md:col-6'>
              <h6>
                {props.payment.importeDeuda}
              </h6>
            </div>
          </div>
        </Dialog>
      </>
    );
  }else{
    return (
      <>
        <Dialog
          visible={props.paymentDialog}
          style={{ width: '55vw' }}
          breakpoints={{ '960px': '95vw' }}
          header={'Cargando...'}
          modal
          className='p-fluid'
          footer={props.paymentDialogFooter}
          onHide={props.hideDialog}
        />
      </>
    );
  }
};

export default PaymentsViewModal;
