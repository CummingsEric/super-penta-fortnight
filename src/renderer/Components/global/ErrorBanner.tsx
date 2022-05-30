import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import { setErrorMessages } from 'renderer/Store/errorMessages';

const ErrorBanner = () => {
	const dispatch = useDispatch();

	const errorMessages = useSelector(
		(state: MainState) => state.errorMessages.value
	);

	console.log(errorMessages.length);

	if (errorMessages.length === 0) {
		return <></>;
	}

	const clearError = () => {
		const errorMessagesNew = [...errorMessages];
		errorMessagesNew.shift();
		dispatch(setErrorMessages(errorMessagesNew));
	};

	const currentError = errorMessages[0];
	if (currentError.errorType === 'device') {
		return (
			<div className="errorBar ">
				<div className="container ">
					Error Spotify Device cannot be found. Please select a device
					in
					<u>
						<Link className="errorLink " to="/settings">
							Settings
						</Link>
					</u>
					{currentError.text}
					<button
						className="errorClose "
						type="button"
						id="max-unmax-btn"
						onClick={clearError}
					>
						<i className="bi bi-x-lg " />
					</button>
				</div>
			</div>
		);
	}
	return <></>;
};

export default ErrorBanner;
