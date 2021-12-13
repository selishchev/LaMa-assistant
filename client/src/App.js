import React, { useState, useCallback } from 'react';
import './App.css';
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
	// eslint-disable-next-line no-nested-ternary
	const resume = getItems.data != null ? getItems.data.resume : editResume.data != null ? editResume.data.resume : null;
	// eslint-disable-next-line no-nested-ternary
	const items = editResume.data != null ? editResume.data.items : getItems.data != null ? getItems.data.items : null;

	const [isValidInput, setIsValidInput] = useState(true);
	const [professionalRole, setProfessionalRole] = useState({});
	const [areas, setAreas] = useState({});
	React.useEffect(() => {
		fetch(`https://api.hh.ru/professional_roles`)
			.then((response) => response.json())
			.then((json) => setProfessionalRole(json.categories));
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

	const handleSubmit = (e) => {
		e.preventDefault();
	};
	return (
		<div className='App'>
			<div className='search'>
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						value={input}
						onInput={(e) => {
							setInput(e.target.value);
						}}
					/>
					<button
						onClick={() => {
							if (input.trim().length > 0) {
								getItems.callRequest(input);
								setIsValidInput(true);
							} else {
								setIsValidInput(false);
							}
						}}
						type='submit'>
						Get Items
					</button>
				</form>
			</div>

			<div className='alignCenter'>{getItems.loading && <div className='loading'></div>}</div>
			<div className='contentWrapper'>
				{!getItems.loading && resume && !isEmpty(resume) && isValidInput && (
					<div className='surface'>
						<div className='sitebar'>
							<Resume resume={resume} onEditResume={(values) => editResume.callRequest(resume, values)} professionalRole={professionalRole} areas={areas} />
						</div>
						<div className='content'>
							{editResume.loading && <div className='loading'></div>}
							{!editResume.loading && getItems.data && !isEmpty(items) && <Vacancies vacancies={items} />}
							{!editResume.loading && editResume.data && isEmpty(editResume.data.items) && <h1>Vacancies is not found</h1>}
						</div>
					</div>
				)}
				<div className='alignCenter'>{!isValidInput && <div>Input is empty</div>}</div>
				<div className='alignCenter'>{!getItems.loading && resume && isEmpty(resume) && isValidInput && <h1>Resume is not found</h1>}</div>
			</div>
			<div className='alignCenter'>{!getItems.loading && getItems.data == null && isValidInput && <div>HELLO</div>}</div>
			<div className='footer'></div>
		</div>
	);
}

export default App;
