import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {DateFormat} from '../../util/DateFormat';
import { Dropdown } from 'primereact/dropdown';
import {Image} from 'primereact/image';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar/';
import { addLocale } from 'primereact/api';
import { CustomCalendar } from '../../util/CustomCalendar';

const EvidenceViewModel = (props) => {
  
  if(Object.entries(props.payment).length !== 0){

    console.log(props);

    const payment = props.payment;

    const validations = props.validate( props.payment );

    addLocale('es',new CustomCalendar().locale);

    props.quote.numCuota = payment.quote.numCuota;
    props.quote.fecVencCuota = payment.quote.fecVencCuota;
    props.quote.importeCuota = payment.quote.importeCuota;
    props.quote.voucher = payment.quote.voucher;

    return (
      <Dialog
          visible={props.paymentDialog}
          style={{ width: '55vw' }}
          breakpoints={{ '960px': '95vw' }}
          header={'PAGOS '+' - DNI '+payment.user.dni}
          modal
          className='p-fluid'
          footer={props.footer}
          onHide={props.hideDialog}
        >
          <div className='grid p-fluid'>
            <div className='col-12 md:col-6'>
              <label className='label-modal' htmlFor='fecPagoCuota'>
                Voucher
              </label>
              <div style={{
                border:'2px solid silver',
                borderRadius:"10px",
                textAlign:"center"
              }}>
              
              <Image
                src={payment.quote.voucher.secure_url} 
                alt="Image"
                width= "300px"
                height= "400px"
              />
              </div>
              
            </div>

            <div className='col-12 md:col-6'>

              <div className='grid p-fluid'>

              <div className='col-12 md:col-12'>
                    <label className='label-modal' htmlFor='importeCuota'>
                      Costo
                    </label>
                    <InputText
                      id='importeCuota'
                      value={payment.quote.importeCuota}
                      required
                      disabled
                      autoComplete='off'
                    />
                    
                </div>

                <div className='col-12 md:col-12'>
                    <label className='label-modal' htmlFor='numCuota'>
                      Número de cuota
                    </label>
                    <InputText
                      id='numCuota'
                      value={payment.quote.numCuota}
                      required
                      disabled
                      autoComplete='off'
                    />
                    
                </div>

              <div className='col-12 md:col-12'>
                      <label className='label-modal' htmlFor='fecPagoCuota'>
                        Fecha de pago
                      </label>
                      <Calendar
                        locale="es"
                        id='fecPagoCuota'
                        value={new DateFormat(props.quote.fecPagoCuota).getDate()}
                        onChange={(e) => props.onInputChange( e , 'fecPagoCuota')}                      
                        required
                        autoComplete='off'
                        keyfilter='date'
                        dateFormat="dd-mm-yy"
                        className={classNames({
                          'p-invalid': props.submitted && !props.quote.fecPagoCuota,
                        })}
                      />
                      {
                        props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.fecPagoCuota}</small>):(<></>)
                      }
                </div>
              
                <div className='col-12 md:col-12'>
                    <label className='label-modal' htmlFor='codOperacion'>
                      Código de operación
                    </label>
                    <InputText
                      id='codOperacion'
                      value={props.quote.codOperacion}
                      onChange={(e) => props.onInputChange(e, 'codOperacion')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.quote.codOperacion,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.codOperacion}</small>):(<></>)
                    }
                </div>

                

                <div className='col-12 md:col-12'>
                    <label className='label-modal' htmlFor='metodoPago'>
                      Método de pago
                    </label>
                    <Dropdown
                      id='metodoPago'
                      value={props.quote.metodoPago}
                      options={props.metodoPagoOptions}
                      onChange={(e) => props.onInputChange(e, 'metodoPago')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.quote.metodoPago,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.metodoPago}</small>):(<></>)
                    }
                </div>

              </div>

            </div>
          </div>

        </Dialog>         
    )
  };
}

export default EvidenceViewModel;
