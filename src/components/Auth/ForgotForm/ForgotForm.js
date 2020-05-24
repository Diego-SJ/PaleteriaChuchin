import React from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
// import { validateEmail } from '../../../utils/Validations';
// import firebase from '../../../utils/Firebase';
import './ForgotForm.scss';

const logo = require('../../../assets/img/ice-cream.png');

export default function ForgotForm(props) {
	const { setSelectedForm } = props;
	return (
		<div className='login-form'>
			<img className='login-form__logo' src={logo} alt='ice-cream' />
			<h1 className='login-form__title'>Recuperar contraseña</h1>
			<Form className='login-form__content'>
				<Form.Field>
					<Input
						type='email'
						name='email'
						placeholder='Correo electrónico'
						icon='mail'
					/>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						// loading={isLoading}
						content='Enviar códico'
					/>
				</Form.Field>
				<Form.Field className='link-form'>
					<span
						onClick={(e) => setSelectedForm('login')}
						className='link-form__text'
					>
						Inicio de sesión
					</span>
				</Form.Field>
			</Form>
		</div>
	);
}
