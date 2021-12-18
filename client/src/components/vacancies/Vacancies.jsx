import React from 'react';
import PropTypes from 'prop-types';
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

const Vacancies = ({ vacancies }) => (
	<div className={classes.container}>
		{/* <h1>Vacancies ({vacancies.length})</h1> */}

		<div className={classes.wrapper}>
			{vacancies.map(
				(vacancy, id) =>
					!vacancy.errors && (
						<div key={vacancy.id + id} className={classes.item}>
							<h3>
								{id + 1} {vacancy.name} <br />
								rate: {vacancy.rate} <br />
								{vacancy.area.name} <br />
								{vacancy.experience.name} <a href={vacancy.alternate_url}>hh</a> <br />
								{vacancy.salary && getSalary(vacancy.salary.from, vacancy.salary.to)} <br />
								откликов {vacancy.counters.responses} <br />
							</h3>

							{vacancy.snippet.requirement && <div dangerouslySetInnerHTML={{ __html: vacancy.snippet.requirement }} />}
							{vacancy.snippet.responsibility && <div dangerouslySetInnerHTML={{ __html: vacancy.snippet.responsibility }} />}
							{vacancy.description && <div dangerouslySetInnerHTML={{ __html: vacancy.description }} />}
						</div>
					)
			)}
		</div>
	</div>
);

Vacancies.propTypes = {
	vacancies: PropTypes.array,
};

export default Vacancies;
