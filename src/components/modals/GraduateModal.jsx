import React from 'react';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar/';
import { Dropdown } from 'primereact/dropdown';
import {DateFormat} from '../../util/DateFormat';
import { CustomCalendar } from '../../util/CustomCalendar';
import { addLocale } from 'primereact/api';

const GraduateModal = (props) => {
  
  addLocale('es',new CustomCalendar().locale);
  const validations = props.validate( props.graduate );
    if(props.graduate.startDate !== undefined && props.graduate.endDate !== undefined){
        return (
            <div>
              <Dialog
                visible={props.graduateDialog}
                style={{ width: '55vw' }}
                breakpoints={{ '960px': '95vw' }}
                header={props.editar ? 'Editar Diplomado '+props.graduate.code  : 'Registrar Diplomado'}
                modal
                className='p-fluid'
                footer={props.graduateDialogFooter}
                onHide={props.hideDialog}
              >
                <div className='mb-3'>
                  {props.error && <small className='p-error'>{props.error}</small>}
                </div>
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='name'>
                      Nombre
                    </label>
                    <InputText
                      id='name'
                      value={props.graduate.name}
                      onChange={(e) => props.onInputChange(e, 'name')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.name,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.name}</small>):(<></>)
                    }
                  </div>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='cost'>
                      Costo
                    </label>
                    <InputText
                      id='cost'
                      value={props.graduate.cost}
                      onChange={(e) => props.onInputChange(e, 'cost')}
                      required
                      autoComplete='off'
                      keyfilter='int'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.cost,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.cost}</small>):(<></>)
                    }
                  </div>
                </div>
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='startDate'>
                      Inicio
                    </label>
                    <Calendar
                      locale="es"
                      id='startDate'
                      value={new DateFormat(props.graduate.startDate).getDate()}
                      onChange={(e) => props.onInputChange( e , 'startDate')}                      
                      required
                      autoComplete='off'
                      keyfilter='date'
                      dateFormat="dd-mm-yy"
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.startDate,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.startDate}</small>):(<></>)
                    }
                  </div>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='endDate'>
                      Finalización
                    </label>
                    <Calendar
                      locale="es"
                      id='endDate'
                      value={new DateFormat(props.graduate.endDate).getDate()}
                      onChange={(e) => props.onInputChange( e , 'endDate')}                      
                      required
                      autoComplete='off'
                      dateFormat="dd-mm-yy"
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.endDate,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.endDate}</small>):(<></>)
                    }
                  </div>
                </div>
               
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='status'>
                      Estado
                    </label>
                    <Dropdown
                      id='status'
                      value={props.graduate.status}
                      options={props.statusOptions}
                      onChange={(e) => props.onInputChange(e, 'status')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.status,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.status}</small>):(<></>)
                    }
                  </div>

                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='sessions'>
                      Sesiones
                    </label>
                    <InputText
                      id='sessions'
                      value={props.graduate.sessions}
                      onChange={(e) => props.onInputChange(e, 'sessions')}
                      required
                      autoComplete='off'
                      keyfilter='int'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.sessions,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.sessions}</small>):(<></>)
                    }
                  </div>
                 
                </div>
        
              </Dialog>
            </div>
        );

    }else{ 
        
        return (
            <div>
              <Dialog
                visible={props.graduateDialog}
                style={{ width: '55vw' }}
                breakpoints={{ '960px': '95vw' }}
                header={props.editar ? 'Editar Diplomado '+props.graduate.code : 'Registrar Diplomado'}
                modal
                className='p-fluid'
                footer={props.graduateDialogFooter}
                onHide={props.hideDialog}
              >
                <div className='mb-3'>
                  {props.error && <small className='p-error'>{props.error}</small>}
                </div>
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='name'>
                      Nombre
                    </label>
                    <InputText
                      id='name'
                      value={props.graduate.name}
                      onChange={(e) => props.onInputChange(e, 'name')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.name,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.name}</small>):(<></>)
                    }
                  </div>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='cost'>
                      Costo
                    </label>
                    <InputText
                      id='cost'
                      value={props.graduate.cost}
                      onChange={(e) => props.onInputChange(e, 'cost')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.cost,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.cost}</small>):(<></>)
                    }
                  </div>
                </div>
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='startDate'>
                      Inicio
                    </label>
                    <Calendar
                      locale="es"
                      id='startDate'
                      value={new DateFormat(props.graduate.startDate).getDate()}
                      onChange={(e) => props.onInputChange( e , 'startDate')}                      
                      required
                      autoComplete='off'
                      keyfilter='date'
                      dateFormat="dd-mm-yy"
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.startDate,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.startDate}</small>):(<></>)
                    }
                  </div>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='endDate'>
                      Finalización
                    </label>
                    <Calendar
                      locale="es"
                      id='endDate'
                      value={new DateFormat(props.graduate.endDate).getDate()}
                      onChange={(e) => props.onInputChange( e , 'endDate')}                      
                      required
                      autoComplete='off'
                      dateFormat="dd-mm-yy"
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.endDate,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.endDate}</small>):(<></>)
                    }
                  </div>
                </div>
               
                <div className='grid p-fluid'>
                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='status'>
                      Estado
                    </label>
                    <Dropdown
                      id='status'
                      value={props.graduate.status}
                      options={props.statusOptions}
                      onChange={(e) => props.onInputChange(e, 'status')}
                      required
                      autoComplete='off'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.status,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.status}</small>):(<></>)
                    }
                  </div>

                  <div className='col-12 md:col-6'>
                    <label className='label-modal' htmlFor='sessions'>
                      Sesiones
                    </label>
                    <InputText
                      id='sessions'
                      value={props.graduate.sessions}
                      onChange={(e) => props.onInputChange(e, 'sessions')}
                      required
                      autoComplete='off'
                      keyfilter='int'
                      className={classNames({
                        'p-invalid': props.submitted && !props.graduate.sessions,
                      })}
                    />
                    {
                      props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.sessions}</small>):(<></>)
                    }
                  </div>
                 
                </div>
        
              </Dialog>
            </div>
        );

     }
};

export default GraduateModal;
