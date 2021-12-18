import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select/Select';
import classes from './SelectList.module.css';

const SelectList = ({ professionalRoles, resumeProfessionalRole, putProfessionalRole }) => (
	<div className={classes.options}>
		{professionalRoles.map((spec) => (
			<Select key={spec.id} data={spec} resumeProfessionalRole={resumeProfessionalRole} putProfessionalRole={putProfessionalRole} />
		))}
	</div>
);

SelectList.propTypes = {
	professionalRoles: PropTypes.array,
	putProfessionalRole: PropTypes.func,
	resumeProfessionalRole: PropTypes.object,
};

export default SelectList;
