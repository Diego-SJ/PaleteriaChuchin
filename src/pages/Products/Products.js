import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { map } from 'lodash';

import ProductForm from '../../components/Forms/ProductForm';
import CardviewContainer from '../../components/ListView/CardviewContainer';
import firebase from '../../utils/Firebase';
import 'firebase/firestore';
import './Products.scss';
const productsImg = require('../../assets/img/products.png');

const db = firebase.firestore(firebase);

export default function Users() {
	const [employees, setEmployees] = useState([]);

	useEffect(() => {
		getAllEmployess();
	}, []);

	const getAllEmployess = () => {
		db
			.collection('Employees')
			.get()
			.then((res) => {
				const arrayEmployees = [];
				map(res?.docs, (employee) => {
					const data = employee.data();
					data.id = employee.id;
					arrayEmployees.push(data);
				});
				setEmployees(arrayEmployees);
			});
	};

	return (
		<>
			<div className='general-grid'>
				<Grid>
					<Grid.Row className='general-grid__title'>
						<img src={productsImg} alt='products' />
						<h1>Productos</h1>
					</Grid.Row>
					<Grid.Row className='general-grid__content'>
						<Grid.Column width={6} className='users-left'>
							<ProductForm updateData={getAllEmployess} />
						</Grid.Column>
						<Grid.Column width={10} className='users-right'>
							<CardviewContainer
								data={employees}
								searchText='Buscar empleado'
								type='Employees'
								updateData={getAllEmployess}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		</>
	);
}
