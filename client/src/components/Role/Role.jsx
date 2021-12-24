import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import classes from './Role.module.css';

const Role = ({ name, id, deleteRole }) => (
	<div className={classes.container}>
		<div className={classes.name}>{name}</div>
		<IconButton
			color='default'
			aria-label='delete'
			sx={{
				p: 0.5,
			}}
			onClick={() => deleteRole(id)}>
			<DeleteOutlineOutlinedIcon className={classes.deleteIcon} />
		</IconButton>
	</div>
);

Role.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	deleteRole: PropTypes.func,
};

export default Role;
