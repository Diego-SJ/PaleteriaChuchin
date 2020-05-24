import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, Select } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Image } from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import firebase from '../../../utils/Firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import './ProductForm.scss';
import noImage from '../../../assets/img/picture.png';

const ProductForm = (props) => {
	const { updateData, data, setShowModal } = props;

	const db = firebase.firestore(firebase);

	const [formData, setFormData] = useState(initialFormState());
	const [formError, setFormError] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (data) {
			setFormData({
				name: data.name,
				wholesalePrice: data.wholesalePrice,
				retailPrice: data.retailPrice,
				unit: data.unit,
				imageUrl: '',
				createdAt: data.createdAt,
				createdBy: data.createdBy,
			});
		}
	}, [data]);

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		setImageUrl(file);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		noKeyboard: true,
		onDrop,
	});

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handlerSelect = (data) => {
		setFormData({
			...formData,
			[data.name]: data.value,
		});
	};

	const unit = [
		{ key: 'u', value: 'u', text: 'unidades' },
		{ key: 'pzs', value: 'pzs', text: 'piezas' },
		{ key: 'cjs', value: 'cjs', text: 'cajas' },
		{ key: 'bts', value: 'bts', text: 'botes' },
		{ key: 'm', value: 'm', text: 'metros' },
		{ key: 'cm', value: 'cm', text: 'centímetros' },
		{ key: 'kg', value: 'kg', text: 'kilogramos' },
		{ key: 'g', value: 'g', text: 'gramos' },
		{ key: 'l', value: 'l', text: 'litros' },
		{ key: 'ml', value: 'ml', text: 'mililitros' },
	];

	const uploadImage = (fileName) => {
		const ref = firebase.storage().ref().child(`products/${fileName}`);
		return ref.put(imageUrl);
	};

	const onSubmit = () => {
		setFormError({});
		let errors = {};
		let formOk = true;

		if (!formData.name) {
			errors.name = true;
			formOk = false;
		}
		if (!formData.wholesalePrice) {
			errors.wholesalePrice = true;
			formOk = false;
		}
		if (!formData.retailPrice) {
			errors.retailPrice = true;
			formOk = false;
		}
		if (!formData.unit) {
			errors.unit = true;
			formOk = false;
		}
		if (!imageUrl) {
			formOk = false;
			toast.error('Debes agregar una imágen.');
		}
		setFormError(errors);

		if (formOk) {
			setIsLoading(true);
			if (data) {
				updateProduct();
			} else {
				createProduct();
			}
		}
	};

	const createProduct = () => {
		let user = firebase.auth().currentUser;
		const fileName = uuidv4();
		uploadImage(fileName)
			.then(() => {
				const productDetails = {
					name: formData.name,
					wholesalePrice: formData.wholesalePrice,
					retailPrice: formData.retailPrice,
					unit: formData.unit,
					imageUrl: fileName,
					createdAt: new Date(),
					createdBy: user.displayName,
				};
				db
					.collection('Products')
					.add(productDetails)
					.then(() => {
						toast.success('Producto registrado correctaente.');
						setFormData(initialFormState());
						updateData();
					})
					.catch((err) => {
						toast.error(`Error: ${err.code}`);
					});
			})
			.catch((err) => {
				console.log(`Error: ${err}`);
				toast.error('Error al subir la imágen, inetenta más tarde.');
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const updateProduct = () => {
		let user = firebase.auth().currentUser;
		const productDetails = {
			name: formData.name,
			wholesalePrice: formData.wholesalePrice,
			retailPrice: formData.retailPrice,
			unit: formData.unit,
			imageUrl: '',
			createdAt: new Date(),
			createdBy: user.displayName,
		};
		db
			.collection('Products')
			.doc(data.id)
			.update(productDetails)
			.then(() => {
				toast.success('Producto actualizado correctaente.');
				updateData();
			})
			.catch((err) => {
				toast.error(err.code);
			})
			.finally(() => {
				setIsLoading(false);
				setShowModal(false);
			});
	};

	return (
		<div className='register-user'>
			{!data && <h1>Registrar producto</h1>}
			<Form
				onSubmit={onSubmit}
				onChange={onChange}
				className='register-user__form'
			>
				<Form.Field>
					<Input
						type='text'
						name='name'
						value={formData.name}
						placeholder='Nombre del producto'
						icon='user'
						error={formError.name}
					/>
					{formError.name && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<Input
						type='number'
						name='wholesalePrice'
						value={formData.wholesalePrice}
						placeholder='Precio de mayoreo'
						icon='dollar'
						error={formError.wholesalePrice}
					/>
					{formError.wholesalePrice && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Input
						type='number'
						name='retailPrice'
						value={formData.retailPrice}
						placeholder='Precio de menudeo'
						icon='dollar'
						error={formError.retailPrice}
					/>
					{formError.retailPrice && (
						<span className='error-text'>Campo obligatorio.</span>
					)}
				</Form.Field>
				<Form.Field>
					<Select
						name='unit'
						placeholder='Unidad'
						value={formData.unit}
						onChange={(e, data) => handlerSelect(data)}
						options={unit}
						error={formError.unit}
					/>
					{formError.unit && <span className='error-text'>Campo obligatorio.</span>}
				</Form.Field>
				<Form.Field>
					<div className='upload-image'>
						<div className='upload-image__content' {...getRootProps()}>
							<input {...getInputProps()} />
							<Image src={noImage} />
						</div>
					</div>
				</Form.Field>
				<Form.Field>
					<Button
						className='btn-primary'
						type='submit'
						loading={isLoading}
						content={!data ? 'Registrar producto' : 'Actualizar'}
					/>
				</Form.Field>
			</Form>
		</div>
	);
};

function initialFormState() {
	return {
		name: '',
		wholesalePrice: '',
		retailPrice: '',
		unit: '',
		imageUrl: '',
		createdAt: '',
		createdBy: '',
	};
}

export default ProductForm;
