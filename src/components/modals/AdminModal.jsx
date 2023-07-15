import React from 'react';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const AdminModal = (props) => {

  const validations = props.validate( props.user );

  return (
    <div>
      <Dialog
        visible={props.userDialog}
        style={{ width: '55vw' }}
        breakpoints={{ '960px': '95vw' }}
        header={props.editar ? 'Editar Administrador' : 'Registrar Administrador'}
        modal
        className='p-fluid'
        footer={props.userDialogFooter}
        onHide={props.hideDialog}
      >
        <div className='mb-3'>
          {props.error && <small className='p-error'>{props.error}</small>}
        </div>
        <div className='grid p-fluid'>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='dni'>
              DNI
            </label>
            <InputText
              id='dni'
              value={props.user.dni}
              onChange={ (e) => props.onInputChange(e, 'dni') }
              required
              autoFocus
              autoComplete='off'
              keyfilter='int'
              maxLength='8'
              className={classNames({
                'p-invalid': props.submitted && !props.user.dni,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.dni}</small>):(<></>)
            }

          </div>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='name'>
              Nombre
            </label>
            <InputText
              id='name'
              value={props.user.name}
              onChange={(e) => props.onInputChange(e, 'name')}
              required
              autoComplete='off'
              className={classNames({
                'p-invalid': props.submitted && !props.user.name,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.name}</small>):<></>
            }
          </div>
        </div>
        <div className='grid p-fluid'>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='phone'>
              Celular
            </label>
            <InputText
              id='phone'
              value={props.user.phone}
              onChange={(e) => props.onInputChange(e, 'phone')}
              required
              autoComplete='off'
              keyfilter='int'
              maxLength='9'
              className={classNames({
                'p-invalid': props.submitted && !props.user.phone,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.phone}</small>):<></>
            }

          </div>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='email'>
              Correo
            </label>
            <InputText
              id='email'
              value={props.user.email}
              onChange={(e) => props.onInputChange(e, 'email')}
              required
              autoComplete='off'
              disabled={props.editar ? true : false}
              className={classNames({
                'p-invalid': props.submitted && !props.user.email,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.email}</small>):<></>
            }

          </div>
        </div>
       
        <div className='grid p-fluid'>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='username'>
              Nombre Usuario
            </label>
            <InputText
              id='username'
              value={props.user.username}
              onChange={(e) => props.onInputChange(e, 'username')}
              required
              autoComplete='off'
              disabled={props.editar ? true : false}
              className={classNames({
                'p-invalid': props.submitted && !props.user.username,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.username}</small>):<></>
            }
          </div>
          <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='profession'>
              Cargo
            </label>
            <InputText
              id='profession'
              value={props.user.profession}
              onChange={(e) => props.onInputChange(e, 'profession')}
              required
              autoComplete='off'
              className={classNames({
                'p-invalid': props.submitted && !props.user.profession,
              })}
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.profession}</small>):<></>
            }
          </div>
         
        </div>

        <div className='grid p-fluid'>

          {
            props.editar ? '':  <div className='col-12 md:col-6'>
            <label className='label-modal' htmlFor='password'>
              Contraseña
            </label>
            <Password
              value={props.user.password}
              onChange={(e) => props.onInputChange(e, 'password')}
              required
              className={classNames({
                'p-invalid': props.submitted && !props.user.password,
              })}
              toggleMask
            />
            {
              props.submitted && validations.isValidated===false ? (<small className='p-error'>{validations.password}</small>):<></>
            }
          </div>
          }
        </div>
      </Dialog>
    </div>
  );
};

export default AdminModal;
