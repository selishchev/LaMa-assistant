import React from 'react';
import PropTypes from 'prop-types';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import classes from './Vacancies.module.css';

const getSalary = (from, to) => {
	if (from && !to) {
		return `от ${from}`;
	}
	if (to && !from) {
		return `до ${to}`;
	}
	if (to && from && from === to) {
		return `до ${to}`;
	}
	return `${from}-${to}`;
};
const dateOptions = {
	month: 'long',
	day: 'numeric',
};

const getDate = (date) => {
	const splitDate = date.split('-');

	const result = new Date(+splitDate[0], +splitDate[1], +splitDate[2].split('T')[0]);
	return result.toLocaleString('ru', dateOptions);
};

const Vacancies = ({ vacancies }) => {
	const [viewFullDescriptionId, setViewFullDescriptionId] = React.useState(null);
	const wrapper = React.useRef();
	const descriptionFull = React.useRef();
	const [descriptionFullOffsetHeight, setDescriptionFullOffsetHeight] = React.useState(695);
	const handleChangeViewFullDescription = (event) => {
		setViewFullDescriptionId((current) => (current ? null : event.target.closest('div[id]').id));
	};

	React.useEffect(() => {
		if (descriptionFull.current) {
			setDescriptionFullOffsetHeight(descriptionFull.current.offsetHeight);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [descriptionFull.current]);

	return (
		<div className={classes.container}>
			<div className={!viewFullDescriptionId ? `${classes.wrapper}` : `${classes.wrapper} ${classes.wrapperDisplayNone}`} ref={wrapper}>
				<div>
					{vacancies.map(
						(vacancy) =>
							!vacancy.errors && (
								<div key={vacancy.id} id={vacancy.id} className={classes.item}>
									<div className={classes.rate}>{vacancy.rate}</div>
									<div>
										<div className={classes.vacancyHeader}>
											<div className={classes.leftSide}>
												<div className={classes.title}>
													<a href={vacancy.alternate_url} target={'_blank'} rel='noreferrer'>
														{vacancy.name}
													</a>
												</div>
												<div className={classes.employer}>
													<a href={vacancy.employer.alternate_url} target={'_blank'} rel='noreferrer'>
														{vacancy.employer.name}
													</a>
												</div>
												<div className={classes.area}>{vacancy.area && vacancy.area.name}</div>
												<div className={classes.experience}>
													Требуемый опыт: {vacancy.experience.name.toLowerCase() === 'нет опыта' ? 'не требуется' : vacancy.experience.name.toLowerCase()}
												</div>
											</div>

											<div className={classes.rightSide}>
												<div className={classes.salary}>
													{vacancy.salary ? (
														<span>
															{getSalary(vacancy.salary.from, vacancy.salary.to)} {vacancy.salary.currency === 'RUR' ? 'руб.' : vacancy.salary.currency}
														</span>
													) : (
														<span>з/п не указана</span>
													)}
												</div>
												<div className={classes.responses}>
													{vacancy.counters.responses} <AccountBoxIcon />
												</div>
											</div>
										</div>
										<div className={classes.description}>
											<div className={classes.shortDescription}>
												{vacancy.snippet.requirement && <div dangerouslySetInnerHTML={{ __html: vacancy.snippet.requirement }} />}
												{vacancy.snippet.responsibility && <div dangerouslySetInnerHTML={{ __html: vacancy.snippet.responsibility }} />}
											</div>
											{vacancy.employer.logo_urls && (
												<div className={classes.descriptionImage}>
													<img src={vacancy.employer.logo_urls['240']} alt='vacancy logo' />
												</div>
											)}
										</div>

										<div className={classes.skills}>
											{vacancy.keySkills.map((skill) => (
												<span key={`${skill.name}${vacancy.id}`} className={classes.skill}>
													{skill.name}
												</span>
											))}
										</div>
										<div className={classes.vacancyFooter}>
											<Box
												sx={{
													'& > .css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
													'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: 0, width: '100%', display: 'flex', justifyContent: 'center' },
													'.css-ikb3mf-MuiButtonBase-root-MuiButton-root': {
														fontSize: '12px',
														lineHeight: '1',
														width: '160px',
														p: '8px',
														letterSpacing: '0.01em',
													},
												}}>
												<Button type='submit' variant='outlined' color='inherit' onClick={(e) => handleChangeViewFullDescription(e)}>
													Раскрыть
												</Button>
											</Box>
											<div className={classes.publicationDate}>{getDate(vacancy.published_at)}</div>
										</div>
									</div>
								</div>
							)
					)}
				</div>
			</div>

			{viewFullDescriptionId && (
				<div id={viewFullDescriptionId} className={classes.itemFull}>
					{vacancies
						.filter((vacancy) => vacancy.id === viewFullDescriptionId)
						.map((vacancy) => (
							<div key={vacancy.id}>
								<div className={classes.rate}>{vacancy.rate}</div>
								<div className={classes.vacancyHeader}>
									<div className={classes.leftSide}>
										<div className={classes.title}>
											<a href={vacancy.alternate_url} target={'_blank'} rel='noreferrer'>
												{vacancy.name}
											</a>
										</div>
										<div className={classes.salary}>
											{vacancy.salary && (
												<span>
													{getSalary(vacancy.salary.from, vacancy.salary.to)} {vacancy.salary.currency === 'RUR' ? 'руб.' : vacancy.salary.currency}
												</span>
											)}
										</div>
										<div className={classes.employer}>
											<a href={vacancy.employer.alternate_url} target={'_blank'} rel='noreferrer'>
												{vacancy.employer.name}
											</a>
										</div>
										<div className={classes.area}>{vacancy.address ? vacancy.address.raw : vacancy.area.name}</div>
										<div className={classes.experience}>
											Требуемый опыт: {vacancy.experience.name.toLowerCase() === 'нет опыта' ? 'не требуется' : vacancy.experience.name.toLowerCase()}
										</div>
										<div className={classes.conditions}>
											{vacancy.employment && <span>{vacancy.employment.name}</span>}
											{vacancy.schedule && <span>, {vacancy.schedule.name}</span>}
										</div>
									</div>

									<div className={classes.rightSide}>
										{vacancy.employer.logo_urls ? (
											<div className={classes.descriptionImageFull}>
												<img src={vacancy.employer.logo_urls['240']} alt='vacancy logo' />
											</div>
										) : (
											<div className={classes.noPhoto}>Без фото</div>
										)}
										<div className={classes.responsesFull}>
											{vacancy.counters.responses} <AccountBoxIcon />
										</div>
									</div>
								</div>
								<div className={classes.vacancyHeaderFooter}>
									<Box
										sx={{
											'& > .css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
											'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: 0, width: '100%', display: 'flex', justifyContent: 'center' },
											'.css-ikb3mf-MuiButtonBase-root-MuiButton-root': {
												fontSize: '12px',
												lineHeight: '1',
												width: '160px',
												p: '8px',
												letterSpacing: '0.01em',
											},
										}}>
										<Button type='submit' variant='outlined' color='inherit' onClick={(e) => handleChangeViewFullDescription(e)}>
											Свернуть
										</Button>
									</Box>
									<div className={classes.publicationDate}>{getDate(vacancy.published_at)}</div>
								</div>
								<div className={classes.descriptionFull} ref={descriptionFull}>
									<div dangerouslySetInnerHTML={{ __html: vacancy.fullDescription }} />
									<div className={classes.skills}>
										{vacancy.keySkills.map((skill) => (
											<span key={`${skill.name}${vacancy.id}`} className={classes.skill}>
												{skill.name}
											</span>
										))}
									</div>
								</div>
								{descriptionFullOffsetHeight > 695 && (
									<div className={classes.vacancyFooter}>
										<Box
											sx={{
												'& > .css-1u3bzj6-MuiFormControl-root-MuiTextField-root': { width: '100%' },
												'.css-sghohy-MuiButtonBase-root-MuiButton-root': { borderRadius: 0, width: '100%', display: 'flex', justifyContent: 'center' },
												'.css-ikb3mf-MuiButtonBase-root-MuiButton-root': {
													fontSize: '12px',
													lineHeight: '1',
													width: '180px',
													p: '8px',
													letterSpacing: '0.01em',
												},
											}}>
											<Button type='submit' variant='outlined' color='inherit' onClick={(e) => handleChangeViewFullDescription(e)}>
												Свернуть
											</Button>
										</Box>
									</div>
								)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

Vacancies.propTypes = {
	vacancies: PropTypes.array,
};

export default Vacancies;
