import React, { useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar/';
import { CustomCalendar } from '../../util/CustomCalendar';
import {DateFormat} from '../../util/DateFormat';
import { addLocale } from 'primereact/api';

const QuoteModal = (props) => {

  const validations = props.validate( props.quote );
  addLocale('es',new CustomCalendar().locale);

  return (
    <div>
      <Dialog
        visible={props.quoteDialog}
        style={{ width: '55vw' }}
        breakpoints={{ '960px': '95vw' }}
        header={props.newQuote ? 'Nueva cuota' : 'Editar cuota'}
        modal
        className='p-fluid'
        footer={props.quoteDialogFooter}
        onHide={props.hideQuoteDialog}
      >
        <div className='mb-3'>
          {props.error && <small className='p-error'>{props.error}</small>}
        </div>
        <div className='grid p-fluid'>
          <div className='col-12 md:col-4'>
            <label className='label-modal' htmlFor='numCuota'>
              # Cuota
            </label>
            <InputText
              id='numCuota'
              value={props.quote.numCuota}
              onChange={(e) => props.onInputChange(e, 'numCuota')}
              required
              autoFocus
              autoComplete='off'
              keyfilter='int'
              maxLength='8'
              className={classNames({
                'p-invalid': props.submitted && !props.quote.numCuota,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.numCuota}</small>):(<></>)
            }
          </div>
          <div className='col-12 md:col-4'>
            <label className='label-modal' htmlFor='importeCuota'>
              Importe de la cuota
            </label>
            <InputText
              id='importeCuota'
              value={props.quote.importeCuota}
              onChange={(e) => props.onInputChange(e, 'importeCuota')}
              required
              autoFocus
              autoComplete='off'
              className={classNames({
                'p-invalid': props.submitted && !props.quote.importeCuota,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.importeCuota}</small>):(<></>)
            }
          </div>
          <div className='col-12 md:col-4'>
            <label className='label-modal' htmlFor='fecVencCuota'>
                Fecha de vencimiento
            </label>
            <Calendar
                locale="es"
                id='fecVencCuota'
                value={new DateFormat(props.quote.fecVencCuota).getDate()}
                onChange={(e) => props.onInputChange( e , 'fecVencCuota')}                      
                required
                autoComplete='off'
                keyfilter='date'
                dateFormat="dd-mm-yy"
                className={classNames({
                   'p-invalid': props.submitted && !props.quote.fecVencCuota,
                })}
            />
            {
                props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.fecVencCuota}</small>):(<></>)
            }
            </div>
        </div>
      </Dialog>
    </div>
  );
};

export default QuoteModal;
