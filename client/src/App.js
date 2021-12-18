/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react';
import './App.css';
// import FormControl, { useFormControl } from '@mui/material/FormControl';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Box from '@mui/material/Box';
// import FormHelperText from '@mui/material/FormHelperText';
// import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import WorkSharpIcon from '@mui/icons-material/WorkSharp';
import Resume from './components/resume/Resume';
import Vacancies from './components/vacancies/Vacancies';

const isEmpty = (obj) => Object.keys(obj).length === 0;

const useRequest = (request) => {
	const [state, setState] = useState({
		loading: false,
		data: null,
		error: null,
	});
	const callRequest = useCallback(
		async (...value) => {
			setState({ loading: true, data: null, error: null });
			try {
				const response = await request(...value);
				const data = await response.json();
				setState({ loading: false, data, error: null });
			} catch (error) {
				setState({ loading: false, data: null, error });
			}
		},
		[request]
	);
	return { ...state, callRequest };
};

const mutateResume = (resume, values) =>
	fetch(`http://127.0.0.1:5000/items/edit`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ resume, values }),
	});

const queryResume = (resumeId) =>
	fetch(`http://127.0.0.1:5000/items/${resumeId}`, {
		headers: {
			resumeId,
		},
	});

function App() {
	const [input, setInput] = useState('');
	const getItems = useRequest(queryResume);
	const editResume = useRequest(mutateResume);
	// const [items, setItems] = useState(getItems.data != null ? getItems.data.items : null)
	// eslint-disable-next-line no-nested-ternary
	const resume = getItems.data != null ? getItems.data.resume : editResume.data != null ? editResume.data.resume : null;
	// eslint-disable-next-line no-nested-ternary
	const items = getItems.data != null ? getItems.data.items : editResume.data != null ? editResume.data.items : null;

	const [isValidInput, setIsValidInput] = useState(true);
	const [professionalRoles, setProfessionalRoles] = useState({});
	const [areas, setAreas] = useState({});
	const [viewState, setViewState] = useState(0);
	console.log(viewState);
	const handleChangeView = () => {
		setViewState((current) => {
			if (current === 2) {
				return 0;
			}
			return current + 1;
		});
	};

	React.useEffect(() => {
		fetch(`https://api.hh.ru/professional_roles`)
			.then((response) => response.json())
			.then((json) => setProfessionalRoles(json.categories));
		fetch(`https://api.hh.ru/areas/113`)
			.then((response) => response.json())
			.then((json) => {
				setAreas(
					json.areas.reduce((acc, area) => {
						if (area.id === '1' || area.id === '2') {
							return [...acc, { value: area.id, label: area.name }];
						}
						return [...acc, ...area.areas.map((zone) => ({ value: zone.id, label: zone.name }))];
					}, [])
				);
			});
	}, []);

	const handleSetView = (lastResume, valueForEdit) => {
		setViewState(0);
		return editResume.callRequest(lastResume, valueForEdit);
	};
	// setViewState(0)
	// !editResume.loading && getItems.data && !isEmpty(items);

	// function MyFormHelperText() {
	// 	const { focused } = useFormControl() || {};

	// 	const helperText = React.useMemo(() => {
	// 		if (focused) {
	// 			return 'This field is being focused';
	// 		}

	// 		return 'Helper text';
	// 	}, [focused]);

	// 	return <FormHelperText>{helperText}</FormHelperText>;
	// }
	const [welcomeShow, setWelcomeShow] = useState(true);
	const handleDeleteWelcome = () => {
		setWelcomeShow(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (input.trim().length > 0) {
			getItems.callRequest(input);
			setIsValidInput(true);
		} else {
			setIsValidInput(false);
		}
	};

	return (
		<div className='App'>
			<div className={welcomeShow ? 'welcome' : 'welcome welcomeAway'}>
				<span onClick={handleDeleteWelcome}>Hello</span>
			</div>
			<div className='animatedBorder'></div>
			{!welcomeShow && (
				<div>
					<div className={resume && !isEmpty(resume) && isValidInput ? 'search' : 'search searchMarginTop'}>
						<form onSubmit={(e) => handleSubmit(e)}>
							<div className='searchBox'>
								<Box
									sx={{
										'.MuiOutlinedInput-input': { p: '12px', width: 400 },
										// eslint-disable-next-line max-len
										'.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiFormLabel-root.MuiFormLabel-colorPrimary.css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root':
											{ top: -3 },
										'.css-1a38g3f-MuiButtonBase-root-MuiIconButton-root': { p: 0 },
										'.css-1kty9di-MuiFormLabel-root-MuiInputLabel-root': { zIndex: 0 },
										'.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': { position: 'relative', zIndex: 0 },
										p: 0,
										maxWidth: '100%',
									}}>
									<div className='searchInput'>
										<TextField
											sx={{
												width: '100%',
												input: { background: 'lavender', borderRadius: '4px', outline: 'none', border: 'none' },
												'.css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { outline: 'none', border: 'none' },
												'.css-9ddj71-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { outline: 'none', border: 'none' },
											}}
											value={input}
											onInput={(e) => {
												setInput(e.target.value);
											}}
										/>
									</div>
								</Box>
							</div>
							{/* <input
								type='text'
								value={input}
								onInput={(e) => {
									setInput(e.target.value);
								}}
							/> */}
						</form>
					</div>

					{!getItems.loading && resume && !isEmpty(resume) && isValidInput && (
						<div className='viewBtn'>
							<Box
								sx={{
									// '& > .css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
									'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: '4px', width: 30, display: 'flex', justifyContent: 'center' },
									'.css-1d6wzja-MuiButton-startIcon, .css-i4bv87-MuiSvgIcon-root': { fontSize: '25px', m: 0 },
								}}>
								{viewState === 0 && <Button type='submit' variant='contained' onClick={() => handleChangeView()} startIcon={<MenuBookSharpIcon />}></Button>}
								{viewState === 2 && <Button type='submit' variant='contained' onClick={() => handleChangeView()} startIcon={<EditSharpIcon />}></Button>}
								{viewState === 1 && <Button type='submit' variant='contained' onClick={() => handleChangeView()} startIcon={<WorkSharpIcon />}></Button>}
							</Box>
						</div>
					)}
					<div className='alignCenter'>{getItems.loading && <div className='loading'></div>}</div>
					<div className='contentWrapper'>
						{!getItems.loading && resume && !isEmpty(resume) && isValidInput && (
							<div>
								<div className='surface'>
									<div className={viewState === 2 ? 'sitebar sitebarWidth' : viewState === 0 ? 'sitebar' : 'sitebar displayNone'}>
										<Resume resume={resume} onEditResume={(values) => handleSetView(resume, values)} professionalRoles={professionalRoles} areas={areas} />
									</div>

									<div className={viewState === 1 ? 'content contentWidth' : viewState === 0 ? 'content' : 'content displayNone'}>
										{editResume.loading && <div className='loading'></div>}
										{!editResume.loading && getItems.data && !isEmpty(items) && <Vacancies vacancies={items} />}
										{!editResume.loading && editResume.data && isEmpty(editResume.data.items) && <h1>Vacancies is not found</h1>}
									</div>
								</div>
							</div>
						)}
						<div className='alignCenter'>{!isValidInput && <h1>Введите адрес резюме</h1>}</div>
						<div className='alignCenter'>{!getItems.loading && resume && isEmpty(resume) && isValidInput && <h1>Резюме не найдено</h1>}</div>
					</div>
					{/* <div className='alignCenter'>{!getItems.loading && getItems.data == null && isValidInput && <div>HELLO</div>}</div> */}
					{/* <div className='footer'></div> */}
				</div>
			)}
		</div>
	);
}

export default App;
