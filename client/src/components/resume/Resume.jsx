import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SelectList from '../SelectList/SelectList';

import classes from './Resume.module.css';
import Role from '../Role/Role';
import Skill from '../Skill/Skill';

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

const currencies = [
	{
		value: 'RUR',
		label: '₽',
	},
	{
		value: 'USD',
		label: '$',
	},
	{
		value: 'EUR',
		label: '€',
	},
];

const experience = [
	{ value: 'noExperience', label: 'Нет опыта' },
	{ value: 'between1And3', label: 'От 1 года до 3 лет' },
	{ value: 'between3And6', label: '0т 3 до 6 лет' },
	{ value: 'moreThan6', label: 'Более 6 лет' },
];

// const inputStyle = {
// 	maxWidth: '100%',
// };

// const getExperienceGap = (months) => {
// 	const years = months / 12;
// 	if (years < 1) {
// 		return 'Нет опыта';
// 	}
// 	if (years >= 1 && years < 3) {
// 		return 'От 1 года до 3 лет';
// 	}
// 	if (years >= 3 && years < 6) {
// 		return '0т 3 до 6 лет';
// 	}
// 	return 'Более 6 лет';
// };

const setEditValues = (resume) => ({
	area: resume.area,
	salary: resume.salary.amount,
	currency: resume.salary.currency,
	title: resume.title,
	toggleSalary: resume.toggleSalary,
	toggleTitle: resume.toggleTitle,
	toggleExperience: resume.toggleExperience,
});

const Resume = ({ resume, onEditResume, professionalRoles, areas }) => {
	const [initialValues, setInitialValues] = useState(setEditValues(resume));

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [selectedRoles, setSelectedRoles] = useState(() => new Set(resume.professional_roles.map((role) => role.id)));
	const rolesMap = professionalRoles.reduce((acc, item) => [...acc, ...item.roles], []).reduce((acc, role) => acc.set(role.id, role.name), new Map());
	const [selectedSkills, setSelectedSkills] = useState(new Set(resume.skill_set));
	const [currency, setCurrency] = useState(resume.salary.currency);
	const [description, setDescription] = useState(resume.skills);
	const [resumExperience, setResumExperience] = useState(experience.filter((item) => item.value === resume.total_experience)[0].value);
	const handleChangeResumExperience = (event) => {
		setResumExperience(event.target.value);
	};

	const selectRoles = React.useCallback((isSelected, roles) => {
		setSelectedRoles((current) => {
			const clone = new Set(current);

			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < roles.length; i++) {
				if (isSelected) {
					clone.add(roles[i]);
				} else {
					clone.delete(roles[i]);
				}
			}

			return clone;
		});
	}, []);

	const handleDeleteRole = (id) => {
		selectRoles(false, [id]);
	};
	const handleDeleteSelectedRoles = () => {
		setSelectedRoles(new Set());
	};

	const handleDeleteSelectedSkills = () => {
		setSelectedSkills(new Set());
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		onEditResume({ ...initialValues, professionalRole: [...selectedRoles].map((id) => ({ id })), skillSet: [...selectedSkills], currency, resumExperience, description });
	};

	const handleChange = (event) => {
		setInitialValues((prevValues) => ({
			...prevValues,
			[event.target.id]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
		}));
	};

	const selectSkill = React.useCallback((isSelected, skills) => {
		setSelectedSkills((current) => {
			const clone = new Set(current);

			// eslint-disable-next-line no-plusplus
			for (let i = 0; i < skills.length; i++) {
				if (isSelected && skills[i].trim()) {
					clone.add(skills[i]);
				} else {
					clone.delete(skills[i]);
				}
			}
			return clone;
		});
	}, []);

	const handleDeleteSkill = (name) => {
		selectSkill(false, [name]);
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

	const handleChangeCurrency = (event) => {
		setCurrency(event.target.value);
	};

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
	// console.log(rolesMap);

	// console.log([...selectedRoles].map((role) => `${role}`));

	const [inputSkill, setInputSkill] = useState('');

	const handleInputSkillChange = (event) => {
		setInputSkill(event.target.value);
	};

	const handleSubmitSkill = (event) => {
		// const { inputValue, value } = this.state;
		// if (!inputValue) return;

		if (event.key === 'Enter') {
			event.preventDefault();

			selectSkill(true, [inputSkill]);
			setInputSkill('');
		}
	};

	const handleChangeDescription = (event) => {
		setDescription(event.target.value);
	};

	const [showState, setShowState] = useState(new Map(Object.entries({ skills: false, develop: false, description: false, roles: false })));

	const handleChangeShow = (section, isShow) => {
		setShowState((current) => {
			const clone = new Map(current);
			return clone.set(section, !isShow);
		});
	};
	console.log(description, description.length);
	return (
		<div className={classes.container}>
			{/* <h1>Resume</h1> */}
			<div className={classes.wrapper}>
				<form onSubmit={handleSubmit} className={classes.form}>
					<div className={classes.resumeTitleContainer}>
						<Box
							sx={{
								'& > :not(style)': { width: '100%' },
								'.MuiOutlinedInput-input': { p: '12px' },
								// eslint-disable-next-line max-len
								'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
									{ top: -4, zIndex: 0 },
								'.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
								'.css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
								p: 0,
							}}>
							<div className={classes.title}>
								<TextField id='title' label='Желаемая должность' value={initialValues.title} onChange={(e) => handleChange(e)} />
							</div>
							<div className={classes.toggleTitle}>
								<div className={classes.alignItemsCenter}>
									<Checkbox
										id='toggleTitle'
										checked={initialValues.toggleTitle}
										onChange={(e) => handleChange(e)}
										inputProps={{ 'aria-label': 'controlled' }}
										sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: 18, pr: '3px' } }}
										className={classes.checkbox}
									/>
									<span className={classes.text}>Учитывать должность при поиске</span>
								</div>
							</div>
						</Box>
					</div>

					<div className={classes.searchContainer}>
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
						<legend className={classes.searchLegend}>
							<span>Населенный пункт</span>
						</legend>
					</div>
					<div className={classes.expSalContainer}>
						<div className={classes.experienceContainer}>
							<Box
								sx={{
									'& .MuiTextField-root': { width: 250 },
									'.MuiOutlinedInput-input': { p: '12px' },
									// eslint-disable-next-line max-len
									'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
										{ top: -4, zIndex: 0 },
									'.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': { position: 'relative', zIndex: 0 },
									'.MuiTextField-root': { m: 0 },
								}}>
								<div className={classes.experience}>
									<TextField id='experience' select label='Опыт' value={resumExperience} onChange={(e) => handleChangeResumExperience(e)}>
										{experience.map((item) => (
											<MenuItem key={item.value} value={item.value}>
												{item.label}
											</MenuItem>
										))}
									</TextField>
								</div>
								<div className={classes.toggleExperience}>
									<div className={classes.alignItemsCenter}>
										<Checkbox
											id='toggleExperience'
											checked={initialValues.toggleExperience}
											onChange={(e) => handleChange(e)}
											inputProps={{ 'aria-label': 'controlled' }}
											sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: 18, pr: '3px' } }}
											className={classes.checkbox}
										/>
										<span className={classes.text}>Учитывать опыт</span>
									</div>
								</div>
							</Box>
						</div>
						<div className={classes.salaryContainer}>
							<Box
								sx={{
									'& .MuiTextField-root': { width: 190 },
									'.MuiTextField-root + .MuiTextField-root': { width: 60 },
									'.MuiOutlinedInput-input': { p: '13px' },
									// eslint-disable-next-line max-len
									'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
										{ top: -4, zIndex: 0 },
									'.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': { position: 'relative', zIndex: 0 },
									'.MuiTextField-root': { m: 0 },
									'.css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root': { height: 47 },
								}}>
								<div className={classes.salary}>
									<TextField id='salary' type='number' label='Зарплата' value={initialValues.salary} onChange={(e) => handleChange(e)} />
									<TextField id='currency' sx={{ '.MuiInputBase-input': { pt: '11px', pb: '11px' } }} select value={currency} onChange={(e) => handleChangeCurrency(e)}>
										{currencies.map((option) => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								</div>
								<div className={classes.toggleSalary}>
									<div className={classes.alignItemsCenter}>
										<Checkbox
											id='toggleSalary'
											checked={initialValues.toggleSalary}
											onChange={(e) => handleChange(e)}
											inputProps={{ 'aria-label': 'controlled' }}
											sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: 18, pr: '3px' } }}
											className={classes.checkbox}
										/>
										<span className={classes.text}>Только с зарплатой</span>
									</div>
								</div>
							</Box>
						</div>
					</div>
					<div className={classes.showItem}>
						<div className={classes.alignItemsCenter}>
							<IconButton
								color={showState.get('roles') ? 'primary' : 'default'}
								aria-label='roles'
								sx={{
									p: 0,
									'& .MuiSvgIcon-root': { fontSize: 20, pr: '7px' },
								}}
								onClick={() => handleChangeShow('roles', showState.get('roles'))}>
								{showState.get('roles') ? <VisibilityIcon /> : <VisibilityOffIcon />}
							</IconButton>

							<span className={classes.text}>Специализация</span>
						</div>
					</div>
					{showState.get('roles') && (
						<div className={classes.rolesContainer}>
							<div className={classes.rolesWrapper}>
								<div className={classes.roles}>
									{selectedRoles.size > 0 ? (
										[...selectedRoles].map((id) => rolesMap.has(`${id}`) && <Role key={id} name={rolesMap.get(id)} id={id} deleteRole={handleDeleteRole} />)
									) : (
										<div className={classes.rolesIsEmpty}>По умолчанию: {resume.professional_roles.reduce((acc, employment) => [...acc, employment.name], []).join(', ')}</div>
									)}
									{selectedRoles.size > 0 && (
										<div className={classes.deleteRolesBtnInside}>
											<IconButton
												color='default'
												aria-label='delete'
												sx={{
													p: 0.5,
													'& .MuiSvgIcon-root': { fontSize: 25, pr: '10px' },
												}}
												onClick={() => handleDeleteSelectedRoles()}>
												<CancelPresentationIcon />
											</IconButton>
										</div>
									)}
								</div>
							</div>

							<div className={classes.rolesBtn}>
								<Box
									sx={{
										'& > :not(style)': { width: '50%', fontSize: '12px', m: '0 auto' },
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Button onClick={handleOpen}>Выбрать специализацию</Button>
								</Box>
							</div>
							<Modal
								aria-labelledby='transition-modal-title'
								aria-describedby='transition-modal-description'
								open={open}
								onClose={handleClose}
								closeAfterTransition
								BackdropComponent={Backdrop}
								BackdropProps={{
									timeout: 200,
								}}>
								<Fade in={open}>
									<Box sx={style1}>
										<Box
											sx={{
												...style2,
												'&::-webkit-scrollbar': { width: 5, backgroundColor: '#c4c5f8' },
												'&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2' },
											}}>
											<SelectList professionalRoles={professionalRoles} resumeProfessionalRole={selectedRoles} putProfessionalRole={selectRoles} />
										</Box>
										<div className={classes.btnsModalInside}>
											<IconButton
												color='default'
												aria-label='delete'
												sx={{
													p: 0.5,
													'& .MuiSvgIcon-root': { fontSize: 35, pr: '10px' },
												}}
												onClick={() => handleDeleteSelectedRoles()}>
												<CancelPresentationIcon />
											</IconButton>

											<Button onClick={handleClose} variant='contained'>
												Выбрать
											</Button>
										</div>
									</Box>
								</Fade>
							</Modal>
						</div>
					)}
					<div className={classes.showItem}>
						<div className={classes.alignItemsCenter}>
							<IconButton
								color={showState.get('skills') ? 'primary' : 'default'}
								aria-label='delete'
								sx={{
									p: 0,
									'& .MuiSvgIcon-root': { fontSize: 20, pr: '7px' },
								}}
								onClick={() => handleChangeShow('skills', showState.get('skills'))}>
								{showState.get('skills') ? <VisibilityIcon /> : <VisibilityOffIcon />}
							</IconButton>

							<span className={classes.text}>Навыки</span>
						</div>
					</div>

					{/* <div className={classes.rolesContainer}>
						<div className={classes.rolesWrapper}>
							<div className={classes.roles}></div> */}

					{showState.get('skills') && (
						<div className={classes.skillsContainer}>
							<div className={classes.skillsWrapper}>
								{selectedSkills.size > 0 ? (
									<div className={classes.skills}>
										{[...selectedSkills].map(
											(skill) => (
												<Skill key={skill} name={skill} deleteSkill={handleDeleteSkill} />
											)

											// <span key={id}>{id}</span>
										)}
										{selectedSkills.size > 0 && (
											<div className={classes.deleteSkillsBtnInside}>
												<IconButton
													color='default'
													aria-label='delete'
													sx={{
														p: 0.5,
														'& .MuiSvgIcon-root': { fontSize: 25, pr: '10px' },
													}}
													onClick={() => handleDeleteSelectedSkills()}>
													<CancelPresentationIcon />
												</IconButton>
											</div>
										)}
									</div>
								) : (
									<div className={classes.skillsIsEmpty}>Ничего не указано: напишите ниже свои ключевые навыки</div>
								)}
							</div>

							<Box
								sx={{
									'& > :not(style)': { width: '100%' },
									'.MuiOutlinedInput-input': { p: '12px' },
									// eslint-disable-next-line max-len
									'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
										{ top: -4, zIndex: 0 },
									'.css-1a38g3f-MuiButtonBase-root-MuiIconButton-root': { p: 0 },
									'.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
									p: 0,
									maxWidth: '100%',
								}}>
								<TextField id='skill' label='Навык' value={inputSkill} onKeyPress={(e) => handleSubmitSkill(e)} onChange={(e) => handleInputSkillChange(e)} />
							</Box>
						</div>
					)}

					<div className={classes.showItem}>
						<div className={[classes.alignItemsCenter].join(' ')}>
							<IconButton
								color={showState.get('develop') ? 'primary' : 'default'}
								aria-label='develop'
								sx={{
									p: 0,
									'& .MuiSvgIcon-root': { fontSize: 20, pr: '7px' },
								}}
								onClick={() => handleChangeShow('develop', showState.get('develop'))}>
								{showState.get('develop') ? <VisibilityIcon /> : <VisibilityOffIcon sx={{ opacity: 0.38 }} />}
							</IconButton>

							<span className={[classes.text, classes.textOpacity].join(' ')}>В разработке...</span>
						</div>
					</div>

					{showState.get('develop') && (
						<div className={classes.inDevelopContainer}>
							<Box
								sx={{
									'.MuiOutlinedInput-input': { p: '12px' },
									// eslint-disable-next-line max-len
									'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
										{ top: -3 },
									'.css-1a38g3f-MuiButtonBase-root-MuiIconButton-root': { p: 0 },
									'.css-1kty9di-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
									'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': { position: 'relative', zIndex: 0 },
									p: 0,
									maxWidth: '100%',
								}}>
								<div className={classes.inDevelopEmployment}>
									<TextField label='Занятость' sx={{ width: '100%' }} value={resume.employments.reduce((acc, employment) => [...acc, employment.name], []).join(', ')} disabled />
								</div>
								<div className={classes.inDevelopSchedule}>
									<TextField label='График работы' sx={{ width: '100%' }} value={resume.schedules.reduce((acc, schedule) => [...acc, schedule.name], []).join(', ')} disabled />
								</div>
							</Box>
						</div>
					)}

					<div className={classes.descriptionContainer}>
						<div>
							<Box
								sx={{
									'.css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
									'.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root': {
										p: '10px',
										pb: '30px',
										pt: '15px',
										'& > #outlined-textarea': {
											'&::-webkit-scrollbar': { width: 5, backgroundColor: '#c4c5f8' },
											'&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2' },
										},
									},
									// maxWidth: '100%',
								}}>
								{showState.get('description') ? (
									<TextField
										id='outlined-textarea'
										value={description}
										label='Описание'
										placeholder='Напишите, пожалуйта'
										multiline
										// maxRows={1000}
										onChange={(e) => handleChangeDescription(e)}
									/>
								) : (
									<div>
										<TextField
											id='outlined-textarea'
											value={description}
											label='Описание'
											placeholder='Напишитео себе'
											maxRows={4}
											multiline
											onChange={(e) => handleChangeDescription(e)}
										/>
									</div>
								)}
								<div className={classes.showDescription}>
									<IconButton
										color={showState.get('description') ? 'primary' : 'default'}
										aria-label='delete'
										sx={{
											p: 0,
											'& .MuiSvgIcon-root': { fontSize: 20 },
										}}
										onClick={() => handleChangeShow('description', showState.get('description'))}>
										{showState.get('description') ? <FullscreenExitIcon /> : <FullscreenIcon />}
									</IconButton>
								</div>
							</Box>
						</div>
					</div>
					<div className={classes.submitBtnContainer}>
						<Box
							sx={{
								'& > .css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
								'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: 0, width: '100%', display: 'flex', justifyContent: 'center' },
								'.css-1d6wzja-MuiButton-startIcon, .css-i4bv87-MuiSvgIcon-root': { fontSize: '25px', m: 0 },
								// maxWidth: '100%',
							}}>
							<Button type='submit' variant='contained' startIcon={<ScreenSearchDesktopIcon />}></Button>
						</Box>
					</div>
				</form>
			</div>
		</div>
	);
};

Resume.propTypes = {
	resume: PropTypes.object,
	onEditResume: PropTypes.func,
	professionalRoles: PropTypes.array,
	areas: PropTypes.array,
};

export default Resume;
