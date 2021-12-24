/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react';
import './App.css';
import Typed from 'typed.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import WorkSharpIcon from '@mui/icons-material/WorkSharp';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import Resume from './components/resume/Resume';
import Vacancies from './components/vacancies/Vacancies';

const welcomeOptions = {
	strings: ['', 'Я удобный', 'Я умный', 'Я лучший...', 'Я нуждаюсь только в твоем резюме^2000.'],
	typeSpeed: 60,
	backSpeed: 60,
	backDelay: 1000,
	showCursor: true,
	fadeOutDelay: 1000,
};

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
	fetch(`https://lamainfoapi.herokuapp.com/items/edit`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ resume, values }),
	});

const queryResume = (resumeId) =>
	fetch(`https://lamainfoapi.herokuapp.com/items/${resumeId}`, {
		headers: {
			resumeId,
		},
	});

let loaderCouner = 0;
let exeptionCouner = 0;

function App() {
	const [input, setInput] = useState('');
	const getItems = useRequest(queryResume);
	const editResume = useRequest(mutateResume);
	// eslint-disable-next-line no-nested-ternary
	const resume = getItems.data != null ? getItems.data.resume : editResume.data != null ? editResume.data.resume : null;
	const [items, setItems] = useState([]);
	const [isValidInput, setIsValidInput] = useState(true);
	const [professionalRoles, setProfessionalRoles] = useState({});
	const [areas, setAreas] = useState({});
	const [viewState, setViewState] = useState(0);
	if (resume && !isEmpty(resume)) {
		loaderCouner += 1;
	}

	React.useEffect(() => {
		if (editResume.data) {
			setItems(editResume.data.items);
		}
	}, [editResume.data]);
	React.useEffect(() => {
		if (getItems.data) {
			setItems(getItems.data.items);
		}
	}, [getItems.data]);

	const handleChangeView = () => {
		setViewState((current) => {
			if (current === 2) {
				return 0;
			}
			return current + 1;
		});
	};

	React.useEffect(() => {
		// eslint-disable-next-line no-unused-vars
		const typed = new Typed('.secondWord', welcomeOptions);

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

	const [welcomeShow, setWelcomeShow] = useState(true);
	const handleDeleteWelcome = () => {
		setWelcomeShow(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		exeptionCouner += 1;
		if (input.trim().length > 0) {
			getItems.callRequest(input);
			setIsValidInput(true);
		} else {
			setIsValidInput(false);
		}
	};
	const [showSearch, setShowSearch] = useState('notShowSearch');
	const handleChangeShowSearch = () => setShowSearch((current) => (current === 'showSearch' ? 'notShowSearch' : 'showSearch'));

	const [welcomeBtnClass, setWelcomeBtnBlinking] = React.useState('welcomeBtn');

	React.useEffect(() => {
		setTimeout(() => setWelcomeBtnBlinking('welcomeBtn welcomeBtnBlinking'), 13000);
	}, []);

	return (
		<div className='App'>
			<div className={welcomeShow ? 'welcome' : 'welcome welcomeAway'} onClick={handleDeleteWelcome}>
				<div className='startPhrase'>
					<h1>
						<span className='secondWord'></span>
					</h1>
				</div>

				<span className={welcomeBtnClass}>Искать</span>
			</div>
			<div className='animatedBorder'></div>
			{!welcomeShow && (
				<div>
					<div className={loaderCouner > 0 ? `search searchTop ${showSearch}` : exeptionCouner > 0 ? 'search searchMarginTop' : 'search searchCenter'}>
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
											autoComplete='off'
											value={input}
											onInput={(e) => {
												setInput(e.target.value);
											}}
										/>
									</div>
								</Box>
							</div>
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
							<Box
								sx={{
									'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: '4px', width: 30, display: 'flex', justifyContent: 'center' },
									'.css-1d6wzja-MuiButton-startIcon, .css-i4bv87-MuiSvgIcon-root': { fontSize: '25px', m: 0 },
								}}>
								<Button type='submit' variant='contained' onClick={() => handleChangeShowSearch()} startIcon={showSearch === 'notShowSearch' ? <LinkOffIcon /> : <LinkIcon />}></Button>
							</Box>
						</div>
					)}

					<div className='contentWrapper'>
						{!getItems.loading && resume && !isEmpty(resume) && isValidInput && (
							<div>
								<div className={showSearch === 'notShowSearch' ? 'surface' : 'surface surfaceMarginTop'}>
									<div className={viewState === 2 ? 'sitebar sitebarWidth' : viewState === 0 ? 'sitebar' : 'sitebar displayNone'}>
										<Resume resume={resume} onEditResume={(values) => handleSetView(resume, values)} professionalRoles={professionalRoles} areas={areas} />
									</div>

									<div className={viewState === 1 ? 'content contentWidth' : viewState === 0 ? 'content' : 'content displayNone'}>
										{editResume.loading && <div className='loading centered'></div>}
										{!editResume.loading && getItems.data && !isEmpty(items) && <Vacancies vacancies={items} />}
										{!editResume.loading && editResume.data && isEmpty(editResume.data.items) && (
											<div className='centered'>
												<h1>Подходящих вакансий не найдено</h1>
											</div>
										)}
									</div>
								</div>
							</div>
						)}

						<div className='previewMessage'>
							<div className='alignCenter'>{getItems.loading && <div className='loading'></div>}</div>
							<div className='alignCenter'>{!isValidInput && <h1>Введите адрес резюме</h1>}</div>
							<div className='alignCenter'>{!getItems.loading && resume && isEmpty(resume) && isValidInput && <h1>Резюме не найдено</h1>}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
