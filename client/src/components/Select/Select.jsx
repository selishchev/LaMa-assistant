import React from 'react';
import PropTypes from 'prop-types';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Checkbox from '@mui/material/Checkbox';
import classes from './Select.module.css';

const Select = ({ data, resumeProfessionalRole, putProfessionalRole, key }) => {
	const [resumeRolesEditByCategody, setResumeRolesEditByCategody] = React.useState(
		data.roles.map((role) => role.id).filter((roleId) => resumeProfessionalRole.map((role) => role.id).includes(roleId))
	);
	const [isOpen, setIsOpen] = React.useState(false);
	React.useEffect(() => putProfessionalRole(resumeRolesEditByCategody, data.name), []);

	const toggleOpen = () => setIsOpen(!isOpen);
	const handleChange = (event) => {
		if (!resumeRolesEditByCategody.includes(event.target.id)) {
			putProfessionalRole([...resumeRolesEditByCategody, event.target.id], data.name);
			return setResumeRolesEditByCategody([...resumeRolesEditByCategody, event.target.id]);
		}
		putProfessionalRole(
			resumeRolesEditByCategody.filter((id) => id !== event.target.id),
			data.name
		);
		return setResumeRolesEditByCategody(resumeRolesEditByCategody.filter((id) => id !== event.target.id));
	};

	const handleChangeCategory = () => {
		if (resumeRolesEditByCategody.length === data.roles.length) {
			setResumeRolesEditByCategody([]);
			putProfessionalRole([], data.name);
		} else {
			setResumeRolesEditByCategody(data.roles.map((role) => role.id));
			putProfessionalRole(
				data.roles.map((role) => role.id),
				data.name
			);
		}
	};

	return (
		<div>
			<div className={classes.select}>
				<span className={classes.arrowContainer}>
					<ArrowForwardIosIcon sx={{ fontSize: 15 }} className={isOpen ? classes.arrowDown : classes.arrowUp} onClick={toggleOpen} />
				</span>
				<Checkbox
					id={data.id}
					checked={resumeRolesEditByCategody.length === data.roles.length}
					indeterminate={resumeRolesEditByCategody.length > 0 && resumeRolesEditByCategody.length !== data.roles.length}
					onChange={() => handleChangeCategory()}
					inputProps={{ 'aria-label': 'controlled' }}
					sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
					className={classes.checkbox}
				/>
				<span key={key} className={classes.name}>
					{data.name}
				</span>
			</div>
			{isOpen && (
				<div>
					{data.roles.map((role) => (
						<div key={role.id} className={classes.option}>
							<Checkbox
								id={role.id}
								checked={resumeRolesEditByCategody.includes(role.id)}
								onChange={(e) => handleChange(e)}
								inputProps={{ 'aria-label': 'controlled' }}
								sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
								className={classes.checkbox}
							/>
							{/* <input type='checkbox' id={role.id} checked={resumeRolesEdit.includes(role.id)} onChange={(e) => handleChange(e)} /> */}
							<span className={classes.name}>{role.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Select;

Select.propTypes = {
	data: PropTypes.object,
	resumeProfessionalRole: PropTypes.array,
	key: PropTypes.string,
	putProfessionalRole: PropTypes.func,
};
