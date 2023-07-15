/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { DateFormat } from '../util/DateFormat';
import URL from '../config/Api';
import EvidenceViewModel from './modals/EvidenceViewModal';
import { NavLink } from 'react-router-dom';
import Loader         from  './Loader';

const Evidence = ({ setIsLogin }) => {

  const baseQuoteUrl   = `${URL}/quotes`;
  const basePaymentUrl   = `${URL}/payments`;
  const baseQuoteUpStatus = `${URL}/quotes/update`;
  
  const [datos, setDatos] = useState([]);
  const [payment, setPayment] = useState([]);
  const [token, setToken] = useState('');
  const [globalFilter, setGlobalFilter] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [quote, setQuote] = useState([]);
  const [quoteId,setQuoteId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emptyQuote = {
    numCuota:'',
    fecVencCuota: '',
    importeCuota: '',

    fecPagoCuota: '',
    codOperacion: '',
    metodoPago: '',
    status: "",
    voucher:"",
  }

  const metodoPagoOptions = [
    { label: 'Transferencia BCP', value: 'Transferencia BCP' },
    { label: 'Transferencia Interbank', value: 'Transferencia Interbank' },
    { label: 'Transferencia BBVA', value: 'Transferencia BBVA' },
    { label: 'Transferencia Scotiabank', value: 'Transferencia Scotiabank' },
    { label: 'Transferencia Banco Pichincha', value: 'Transferencia Banco Pichincha' },
    { label: 'Deposito BCP', value: 'Deposito BCP' },
    { label: 'Deposito Interbank', value: 'Deposito Interbank' }, 
    { label: 'Deposito BBVA', value: 'Deposito BBVA' }, 
    { label: 'Deposito Scotiabank', value: 'Deposito Scotiabank' }, 
    { label: 'Deposito Banco Pichincha', value: 'Deposito Banco Pichincha' },
    { label: 'Pago Yape', value: 'Pago Yape' }, 
    { label: 'Pago Plin', value: 'Pago Plin' },  
  ];

  const toast = useRef(null);
  const dt = useRef(null);

  const validate = (data) => {

    let errors = {};

    errors.isValidated = false;

    if (!data.fecPagoCuota) {
      errors.fecPagoCuota = 'Fecha de pago es requerido';
    }

    if (!data.codOperacion) {
      errors.codOperacion = 'Código de operación es requerido';
    }

    if( !data.metodoPago ) {
      errors.metodoPago = 'Método de pago es requerido';
    }

    if( Object.keys(errors).length === 1 ){
      errors.isValidated = true;
    }

    return errors;
};

const onInputChange = (e, name) => {
  if( name === "fecPagoCuota" ){
      const val = (e.target && e.target.value) || '';
      const stringDate = new DateFormat(val);
      let _payment = { ...quote };
      _payment[`${name}`] = stringDate.getStringDate().valueOf();
      setQuote(_payment);
  }else{


      const val = (e.target && e.target.value) || '';
      let _payment = { ...quote };
      _payment[`${name}`] = val;
      setQuote(_payment);

      
  }
};

  //TODO: Get payments**
  const cargarDatos = async (token) => {
    if(token){
      setIsLoading(true);
      const resPayment = await axios.get(basePaymentUrl, {
        headers: { Authorization: token },
      });
      const resQuote = await axios.get(baseQuoteUrl, {
        headers: { Authorization: token },
      });

      const arrayQuote = [];
      const quotePayment     = resPayment.data.filter( o => o.quote.length > 0);
      quotePayment.forEach((item,index)=>{
        let sentQuote = item.quote.filter(o=>o.status === "enviado");
        if(sentQuote.length > 0){
          sentQuote.forEach((quote)=>{
            let row = {
              user : quotePayment[index].student,
              graduate: quotePayment[index].graduate,
              quote : quote
            }
            arrayQuote.push(row);
          })
        }
      })
      
      setDatos(arrayQuote);
      setIsLoading(false);
    }
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

  const viewQuotes = async (rowData) => {
    setPayment(rowData);
    setQuoteId(rowData.quote._id);
    setQuote(emptyQuote);
    setPaymentDialog(true);
  }

  const hideDialog = () => {
    setPaymentDialog(false);
  };

  const postQuote = async(quote) =>{  
    return await axios.post(
      baseQuoteUrl,
      quote,
      { headers: { Authorization: token } }
    );
  }

  const deleteQuote = async (id) => {
    try {
      await axios.delete(`${baseQuoteUrl}/${id}`, {
        headers: { Authorization: token },
      });
    } catch (error) {
      window.location.href = '/';
    }
  };

  const updateQuote = async(quote) =>{

    await axios.put(
      `${baseQuoteUpStatus}/${quoteId}`,
      {...quote},
      { headers: { Authorization: token } }
    );
    
  }


  const rejectQuotePayment = () => {
    setPaymentDialog(false);
    Swal.fire({
      title: '¿Desea rechazar el pago de la cuota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#64748B',
      confirmButtonText: '<i class="pi pi-check"></i> Sí',
      cancelButtonText: '<i class="pi pi-times"></i> Cancelar',
    }).then((result) => {
      if (result.isConfirmed) { 
        if(validate(quote).isValidated){
          updateQuote({status:'pendiente'});
          cargarDatos(token);
        }else{
          Swal.fire(
            {
              position: 'center',
              title: 'Aviso',
              text: 'Debe completar todos los campos',
              icon: 'error',
              showConfirmButton: true,
            },
          );
        }
      }
    });
  }

  const confirmQuotePayment = () => {
    setPaymentDialog(false);
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: '¿Desea aprobar el pago de la cuota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366F1',
      cancelButtonColor: '#64748B',
      confirmButtonText: '<i class="pi pi-check"></i> Sí',
      cancelButtonText: '<i class="pi pi-times"></i> Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {  
        if(validate(quote).isValidated){
          quote.status = 'pagado';
          updateQuote(quote).then(()=>{
            cargarDatos(token);
          })
        }else{
          Swal.fire(
            {
              position: 'center',
              title: 'Aviso',
              text: 'Debe completar todos los campos',
              icon: 'error',
              showConfirmButton: true,
            },
          );
        }
      }
    });
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='Refrescar'
          icon='pi pi-refresh'
          className='p-button-sm'
          onClick={cargarDatos}
        />
        <NavLink className='nav-link' to='/payment'>
          <Button
          label='Pagos'
          className='p-button-sm p-button-secondary'
         />
        </NavLink>
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
            icon='pi pi-pencil'
            className="p-button-rounded p-button-primary p-button-sm mr-1"
            onClick={() => viewQuotes(rowData)}
        />
      </React.Fragment>
    );
  };

  const evidenceDialogFooter = (
    <div style={{textAlign:"center"}}>
      <React.Fragment>
        <Button
          label='Rechazar'
          icon='pi pi-times'
          className='p-button-outlined p-button-secondary'
          onClick={rejectQuotePayment}
        />
        <Button
            label='Aceptar'
            icon='pi pi-check'
            className='p-button'
            onClick={confirmQuotePayment}
          />
      </React.Fragment>
    </div>
  );
  return (
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
                  emptyMessage='No se encontraron pagos.'
                  responsiveLayout='stack'
                  breakpoint='960px'
                  size='small'
                >
                  <Column
                    field='user.dni'
                    header='DNI'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='user.name'
                    header='Nombre'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='graduate.name'
                    header='Diplomado'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='quote.numCuota'
                    header='Cuota pagada'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='quote.fecPagoCuota'
                    header='Fecha de solicitud'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    header='Acciones'
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: '1rem' }}
                  ></Column>
                </DataTable>
                <EvidenceViewModel
                  payment={payment}
                  paymentDialog={paymentDialog}
                  footer={evidenceDialogFooter}
                  hideDialog={hideDialog}
                  validate={validate}
                  onInputChange={onInputChange}
                  quote={quote}
                  metodoPagoOptions={metodoPagoOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evidence;
