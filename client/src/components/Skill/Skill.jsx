import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import classes from '../Role/Role.module.css';

const Skill = ({ name, deleteSkill }) => (
	<div className={classes.container}>
		<div className={classes.name}>{name}</div>
		<IconButton
			color='default'
			aria-label='delete'
			sx={{
				p: 0.5,
			}}
			onClick={() => deleteSkill(name)}>
			<DeleteOutlineOutlinedIcon className={classes.deleteIcon} />
		</IconButton>
	</div>
);

Skill.propTypes = {
	name: PropTypes.string,
	deleteSkill: PropTypes.func,
};

export default Skill;
