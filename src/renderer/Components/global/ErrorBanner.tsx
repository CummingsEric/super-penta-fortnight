import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import { setErrorMessages } from 'renderer/Store/errorMessages';

const ErrorBanner = () => {
	const dispatch = useDispatch();

	const errorMessages = useSelector(
		(state: MainState) => state.errorMessages.value
	);

	if (errorMessages.length === 0) {
		return <></>;
	}

	let dismissible = '';
	if (errorMessages.length === 1) {
		dismissible = 'alert';
	}

	const clearError = () => {
		const errorMessagesNew = [...errorMessages];
		errorMessagesNew.shift();
		// If the alert is closing, give 200 ms for animation to finish before dispatch and rerender
		if (errorMessagesNew.length === 0) {
			setTimeout(() => dispatch(setErrorMessages(errorMessagesNew)), 200);
		} else {
			dispatch(setErrorMessages(errorMessagesNew));
		}
	};

	const currentError = errorMessages[0];
	if (currentError.errorType === 'device') {
		return (
			<div>
				<div
					className="alert errorAlert rounded-0 p-1 border-0 alert-dismissible fade show"
					role="alert"
				>
					<svg
						className="bi flex-shrink-0 me-2"
						width="24"
						height="24"
						role="img"
						aria-label="Danger:"
					>
						<use xlinkHref="#exclamation-triangle-fill" />
					</svg>
					<span>
						<span>
							Error Spotify Device cannot be found. Please select
							a device in&nbsp;
							<Link className="errorLink" to="/settings">
								Settings
							</Link>
							&nbsp;{currentError.text}
						</span>
					</span>
					<button
						type="button"
						className="btn-close p-1 mt-1 me-4"
						data-bs-dismiss={dismissible}
						aria-label="Close"
						onClick={clearError}
					/>
				</div>
			</div>
		);
	}
	return <></>;
};

export default ErrorBanner;
