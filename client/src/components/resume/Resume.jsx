import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Select from '../Select/Select';
import classes from './Resume.module.css';

const style1 = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	height: 550,
	overflow: 'auto',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 3,
};

const style2 = {
	position: 'absolute',
	top: '47%',
	left: '48.5%',
	transform: 'translate(-50%, -50%)',
	width: 550,
	height: 500,
	overflow: 'auto',
	bgcolor: 'background.paper',
	// border: '2px solid #000',
	// boxShadow: 24,
	p: 3,
	pt: 0,
	pb: 0,
};

const getExperienceGap = (months) => {
	const years = months / 12;
	if (years < 1) {
		return 'Нет опыта';
	}
	if (years >= 1 && years < 3) {
		return 'От 1 года до 3 лет';
	}
	if (years >= 3 && years < 6) {
		return '0т 3 до 6 лет';
	}
	return 'Более 6 лет';
};

const setEditValues = (resume) => ({
	area: resume.area,
	salary: resume.salary.amount,
	skills: resume.skills,
	experienceMonths: resume.total_experience.months,
	experienceGap: resume.total_experience.experienceGap,
	employments: resume.employments,
	title: resume.title,
	toggleSalary: resume.toggleSalary,
	toggleTitle: resume.toggleTitle,
	toggleExperience: resume.toggleExperience,
	professionalRole: resume.professional_roles.map((role) => ({ id: role.id })),
});

const Resume = ({ resume, onEditResume, professionalRole, areas }) => {
	const [initialValues, setInitialValues] = useState(setEditValues(resume));
	const [professionalMap, setProfessionalMap] = useState(new Map());
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		onEditResume(initialValues);
	};

	const handleChange = (event) => {
		setInitialValues((prevValues) => ({
			...prevValues,
			[event.target.id]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
			experienceGap: event.target.id === 'experienceMonths' ? getExperienceGap(event.target.value) : getExperienceGap(initialValues.experienceMonths),
		}));
	};

	const editProfessionalRole = (roles, rolesArea) => {
		if (roles.length > 0) {
			setProfessionalMap(professionalMap.set(rolesArea, roles));
		} else {
			professionalMap.delete(rolesArea);
			setProfessionalMap(professionalMap);
		}
		const editRoles = Array.from(professionalMap)
			.reduce((acc, item) => [...acc, ...item[1]], [])
			.map((id) => ({ id }));
		setInitialValues((prevValues) => ({
			...prevValues,
			professionalRole: editRoles,
		}));
	};

	const [areaInput, setAreaInput] = useState(initialValues.area.name);
	const filterColors = (inputValue) => areas.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
	const handleInputChange = (inputValue) => setAreaInput(inputValue);
	const promiseOptions = (inputValue) =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve(filterColors(inputValue));
			}, 1000);
		});

	const handleChangeArea = (value) => {
		setInitialValues((prevValues) => ({
			...prevValues,
			area: value ? { id: 'null', name: value.label } : { id: 'null', name: '' },
		}));
	};

	const DropdownIndicator = (props) => (
		<components.DropdownIndicator {...props}>
			<span></span>
		</components.DropdownIndicator>
	);

	return (
		<div className={classes.container}>
			<h1>Resume</h1>
			<form onSubmit={handleSubmit} className={classes.form}>
				<div>Желаемая должност</div>
				<div>
					<input type='text' id='title' value={initialValues.title} onChange={(e) => handleChange(e)} />
				</div>
				<div>
					<input type='checkbox' id='toggleTitle' checked={initialValues.toggleTitle} onChange={(e) => handleChange(e)} /> Учитывать должность в названии
				</div>
				<br />

				<Button onClick={handleOpen} className={classes.options}>
					Изменить специализацию
				</Button>
				<Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
					<Box sx={style1}>
						<Box sx={style2}>
							<div className={classes.options}>
								{professionalRole.map((spec) => (
									<Select key={spec.name} data={spec} resumeProfessionalRole={initialValues.professionalRole} putProfessionalRole={editProfessionalRole} />
								))}
							</div>
						</Box>
						<div className={classes.btnsModalInside}>
							<Button onClick={handleClose} className={classes.btnModalSubmit}>
								Выбрать
							</Button>
						</div>
					</Box>
				</Modal>

				<br />
				<div>
					Опыт: {initialValues.experienceGap}
					<br />
					<input type='number' id='experienceMonths' value={initialValues.experienceMonths} onChange={(e) => handleChange(e)} /> месяцев
					<br />
					Сделать селекты для ролей
					<br />
					<input type='checkbox' id='toggleExperience' checked={initialValues.toggleExperience} onChange={(e) => handleChange(e)} /> Учитывать опыт
				</div>
				<br />
				<div>Занятость: {initialValues.employments.reduce((acc, employment) => [...acc, employment.name], []).join(', ')}</div>
				<br />
				<AsyncSelect
					components={{ DropdownIndicator }}
					cacheOptions
					onInputChange={handleInputChange}
					loadOptions={promiseOptions}
					onChange={handleChangeArea}
					defaultOptions
					isSearchable
					loadingMessage={() => 'Ищем...'}
					noOptionsMessage={() => 'Совпадений не найдено.'}
					menuIsOpen={!!areaInput.length && areaInput !== initialValues.area.name}
					inputValue={areaInput.name}
					defaultValue={{ value: initialValues.area.id, label: initialValues.area.name }}
				/>
				<br />
				<label htmlFor='salary'>salary</label>
				<input type='number' id='salary' value={initialValues.salary} onChange={(e) => handleChange(e)} />
				<br />
				<div>
					<input type='checkbox' id='toggleSalary' checked={initialValues.toggleSalary} onChange={(e) => handleChange(e)} /> Только с зарплатой
				</div>
				<br />
				<label htmlFor='skills'>skills</label>
				<textarea id='skills' value={initialValues.skills} onChange={(e) => handleChange(e)} />

				<button type='submit'>Submit</button>
			</form>
		</div>
	);
};

Resume.propTypes = {
	resume: PropTypes.object,
	onEditResume: PropTypes.func,
	professionalRole: PropTypes.array,
	areas: PropTypes.array,
};

export default Resume;
