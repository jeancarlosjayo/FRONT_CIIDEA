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
import PaymentsViewModal from './modals/PaymentsViewModal';
import { NavLink } from 'react-router-dom';
import Loader         from  './Loader';
import QuoteModal      from './modals/QuoteModal';

const Payments = ({ setIsLogin }) => {
  const basePaymentUrl = `${URL}/payments`;
  const baseQuoteUrl   = `${URL}/quotes`;
  const [isLoading, setIsLoading] = useState(false)  
  const [datos, setDatos] = useState([]);
  const [payment, setPayment] = useState([]);
  const [token, setToken] = useState('');
  const [globalFilter, setGlobalFilter] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [quoteDialog, setQuoteDialog] = useState(false);
  const [newQuote,setNewQuote] = useState(false);
  const [quote,setQuote] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  const newQuoteEmpty = {
    numCuota : '',
    importeCuota : '',
    fecVencCuota: ''
  }

  const validate = (data) => {

    let errors = {};

    errors.isValidated = false;

    if (!data.numCuota) {
      errors.numCuota = 'Número de cuota es requerido';
    }

    if (!data.fecVencCuota) {
        errors.fecVencCuota = 'Fecha de vencimiento es requerido';
    }

    if (!data.importeCuota) {
      errors.importeCuota = 'Importe de la cuota es requerido';
    }else if ( !Number.isInteger(parseInt(data.importeCuota)) || Number.isNaN(parseFloat(data.importeCuota)) ) {
      errors.importeCuota = 'El importe debe ser entero o decimal.';
    }else if( data.importeCuota.toString().includes(' ') ){
      errors.importeCuota = 'El importe no puede contener espacios en blanco.';
    }else if( parseFloat(data.importeCuota) == 0 ){
      errors.importeCuota = 'El importe no puede ser igual a 0.';
    }

    if( Object.keys(errors).length === 1 ){
      errors.isValidated = true;
    }

    return errors;
};


  //TODO: Get payments**
  const cargarDatos = async (token) => {
    setDatos([]);
    setIsLoading(true);
    const respuesta = await axios.get(basePaymentUrl, { headers: { Authorization: token } });
    if(token){
      respuesta.data.forEach((payment)=>{
        let paid = 0;
        let ultimoPago;
        let isQuotes = false;
        if(payment.quote.length>0){
          isQuotes = true;
          payment.quote.forEach((quo)=>{
            if( quo.status === 'pagado' ){ 
              paid = paid + quo.importeCuota;
              ultimoPago = new DateFormat(quo.fecPagoCuota).getStringDate();
            }
          })
        }
        payment.importePagado = paid;
        payment.importeDeuda  = payment.importeTotal - paid;
        payment.ultimoPago    = ultimoPago;
        payment.isQuotes      = isQuotes;
      })
      setDatos(respuesta.data);
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

  const onInputChange = (e, name) => {
    if( name === "fecVencCuota" ){
        const val = (e.target && e.target.value) || '';
        let _quote = { ...quote };
        _quote[`${name}`] = new DateFormat(val).getStringDate();
        setQuote(_quote);
    }else{
        const val = (e.target && e.target.value) || '';
        let _quote = { ...quote };
        _quote[`${name}`] = val;
        setQuote(_quote);
    }
  };

  const deletePayment = async (payment) => {
    await axios.delete(`${basePaymentUrl}/${payment._id}`, { headers: { Authorization: token } }).then(()=>{
      Swal.fire('Pago eliminado','','success')
    });

    payment.quote.map((quote)=>{deleteQuote(quote)});

    cargarDatos(token);
  }

  const deleteQuote = async (quote) => {
    await axios.delete(`${baseQuoteUrl}/${quote._id}`, { headers: { Authorization: token } });
  }
  const viewQuotes = async (rowData) => {
    setPayment(rowData);
    setPaymentDialog(true);
  }

  const postQuote = async(quote) =>{  

    return await axios.post(
      baseQuoteUrl,
      quote,
      { headers: { Authorization: token } }
    );
  }

  const updateQuote = async(quote,id) =>{

    payment.quote.forEach((item)=>{
      if( item._id === id ){
        item.importeCuota = quote.importeCuota;
      }
    })

    const importeTotal = Object.values(payment.quote).reduce((acumulador, item) => acumulador + item.importeCuota, 0);

    axios.put( `${baseQuoteUrl}/update/${id}`, quote, { headers: { Authorization: token } } );
    
    updatePaymentPut({
      importeTotal: parseFloat(parseFloat(importeTotal).toFixed(2))
    },payment._id);
    
  }

  const updatePayment = async(quote,id) =>{

    await axios.put(
      `${basePaymentUrl}/${id}`,
      {quote},
      { headers: { Authorization: token } }
    );
    cargarDatos(token);

  }

  const updatePaymentPut = async(payment,id) =>{

    await axios.put(
      `${basePaymentUrl}/${id}`,
      {...payment},
      { headers: { Authorization: token } }
    );

    cargarDatos(token);
    
  }

  const createQuotes = async (rowData) => {

    rowData.isQuotes ? 
    Swal.fire(
      'El usuario ya tiene cuotas generadas',
      '',
      'info'
    )
    :
    Swal.fire({
      title: '¿Desea generar las cuotas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(token){

          const dateStartDate = new DateFormat(rowData.graduate.startDate);
          const dateEndDate = new DateFormat(rowData.graduate.endDate);
          const diffDias  = (dateEndDate.getDate().getTime() - dateStartDate.getDate().getTime()) / (1000*60*60*24);
          const diffMeses = Math.floor(( diffDias )/30);
          const cost      = Number.parseFloat((rowData.importeTotal / diffMeses)).toFixed(2);

          let paymentQuotes = [];

          for( var i = 0 ; i < diffMeses ; i++ ){
            let fecQuote = new DateFormat(new Date(dateStartDate.getDate().setMonth(dateStartDate.month+i)));
            let req = {
              numCuota : i+1,
              fecVencCuota : fecQuote.getFormatDate2(),
              fecPagoCuota : '',
              importeCuota : cost,
              status : 'pendiente',
            }
            paymentQuotes.push(req)
          }

          postQuote(paymentQuotes).then((res)=>{
            let quoteList = res.data.map((item)=>{ return item._id })
            updatePayment(quoteList,rowData._id)
          }).then(()=>{
            Swal.fire('Cuotas generadas','','success')
            cargarDatos(token);
          })
        }
      }
    })
  }

  const newQuoteDialog = () => {
    setQuote(newQuoteEmpty);
    setNewQuote(true);
    setQuoteDialog(true);
  }

  const hidePaymentDialog = () => {
    setPaymentDialog(false);
  };

  const hideQuoteDialog = () => {
    setQuoteDialog(false);
  };
  

  const deletePaymentDialog = async (rowData) => {
    Swal.fire({
      title: '¿Desea eliminar las cuotas generadas?',
      text: 'Está acción será irrevertible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(token){
          deletePayment(rowData);
        }
      }
    })
  }

  const postQuoteDialog = async () => {
    setSubmitted(true);
    if(token){
      if(validate(quote).isValidated){
        setIsLoading(true);
        setQuoteDialog(false);
        setPaymentDialog(false);
        quote.status = 'pendiente';
        const response = await postQuote(quote);
        const quoteList = payment.quote.map((quo)=>{return quo._id})
        quoteList.push(response.data._id);

        payment.quote.push(response.data);
    
        const importeTotal = Object.values(payment.quote).reduce((acumulador, item) => acumulador + item.importeCuota, 0);
    
        updatePaymentPut({
          quote       : quoteList,
          importeTotal: parseFloat(parseFloat(importeTotal).toFixed(2)),
        },payment._id);

        cargarDatos(token);
      }
    }
  }

  const editQuoteDialog = (quote) => {
    setNewQuote(false);
    setQuote(quote)
    setQuoteDialog(true);
  }

  const updateQuoteDialog = () => {
    setSubmitted(true);
    if(token){
      if(validate(quote).isValidated){
        setIsLoading(true);
        updateQuote({
          numCuota: quote.numCuota,
          importeCuota: parseFloat(parseFloat(quote.importeCuota).toFixed(2)),
          fecVencCuota: quote.fecVencCuota,
          status: 'pendiente'
        },quote._id)
        setQuoteDialog(false);
        setPaymentDialog(false);
        
      }
    }
  }

  const deleteQuoteDialog = (quote) => {

    setPaymentDialog(false);

    if(quote.status !== "pendiente"){
      Swal.fire({
        icon: 'info',
        html:`No se puede eliminar una cuota con estado <b>${quote.status}</b>.`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: 'Aceptar'
      })
    }else{
      Swal.fire({
        title: '¿Desea eliminar la cuota generada?',
        text: 'Está acción será irrevertible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          if(token){ 
            deleteQuote(quote);
            updatePaymentPut({
              importeTotal: (payment.importeTotal - quote.importeCuota).toFixed(2)
            },payment._id);
          }
        }
      })
    }
    
  }

  const actionBodyTemplateQuotes = (rowData) => {

    return (
      <React.Fragment>
        <div>
      
          <Button
            icon='pi pi-pencil'
            className="p-button-rounded p-button-primary p-button-sm mr-1"
            onClick={() => editQuoteDialog(rowData)}
          />    

          <Button
            icon='pi pi-trash'
            className="p-button-rounded p-button-danger p-button-sm mr-1"
            onClick={() => deleteQuoteDialog(rowData)}
        />   
        </div>
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {

    let template;
    rowData.isQuotes ? 

    template = (
      <>
        <Button
            icon='pi pi-eye'
            className="p-button-rounded p-button-secondary p-button-sm mr-1"
            onClick={() => viewQuotes(rowData)}
        />
        <Button
            icon='pi pi-trash'
            className="p-button-rounded p-button-danger p-button-sm mr-1"
            onClick={() => deletePaymentDialog(rowData)}
        />
      </>
    ) : 
    template = (
      template = (
        <>
          <Button
            icon='pi pi-file'
            className="p-button-rounded p-button-primary p-button-sm mr-1"
            onClick={() => createQuotes(rowData)}
          />
        </>
      )
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

        <NavLink className='nav-link' to='/evidence'>
          <Button
          label='Evidencia de pagos'
          className='p-button-sm p-button-secondary'
         />
        </NavLink>      
        
      </React.Fragment>
    );
  };
  const userDialogFooter = (
    <React.Fragment>
      <Button
        label='Cerrar'
        className='p-button-outlined p-button-secondary'
      />
    </React.Fragment>
  );

  const quoteDialogFooter = (
    <React.Fragment>
      {
        newQuote ? 
        <Button
          label='Generar'
          icon='pi pi-check'
          className='p-button'
          onClick={postQuoteDialog}
        />
        :
        <Button
          label='Actualizar'
          icon='pi pi-check'
          className='p-button'
          onClick={updateQuoteDialog}
        />
      }
        <Button
        label='Cancelar'
        onClick={hideQuoteDialog}
        className='p-button-outlined p-button-secondary'
      />
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
                  emptyMessage='No se encontraron pagos.'
                  responsiveLayout='stack'
                  breakpoint='960px'
                  size='small'
                >
                  <Column
                    field='student.dni'
                    header='DNI'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='student.name'
                    header='Nombre'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='graduate.name'
                    header='Diplomado'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='importeDeuda'
                    header='Deuda actual'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    field='ultimoPago'
                    header='Mes último pago'
                    style={{ minWidth: '1rem' }}
                  ></Column>
                  <Column
                    header='Acciones'
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: '1rem' }}
                  ></Column>
                </DataTable>
                <PaymentsViewModal
                  payment={payment}
                  paymentDialog={paymentDialog}
                  footer={userDialogFooter}
                  hidePaymentDialog={hidePaymentDialog}
                  actionBodyTemplateQuotes={actionBodyTemplateQuotes}
                  newQuoteDialog={newQuoteDialog}
                />
                <QuoteModal
                  quote={quote}
                  hideQuoteDialog={hideQuoteDialog}
                  quoteDialog={quoteDialog}
                  quoteDialogFooter={quoteDialogFooter}
                  validate={validate}
                  onInputChange={onInputChange}
                  submitted={submitted}
                  newQuote={newQuote}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  : appendHtml =(<>Cargando....</>)

  return ( appendHtml );
};

export default Payments;
