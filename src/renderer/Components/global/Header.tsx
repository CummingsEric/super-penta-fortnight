import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => {
	const minimizeButton = () => {
		window.electron.ipcRenderer.sendMessage('minimize', [null]);
	};

	const maxUnmaxButton = () => {
		window.electron.ipcRenderer.sendMessage('max-unmax', [null]);
	};

	const closeButton = () => {
		window.electron.ipcRenderer.sendMessage('close', [null]);
	};

	return (
		<>
			<div className="window-buttons">
				<button
					className="menu-bar-button "
					type="button"
					id="minimize-btn"
					onClick={minimizeButton}
				>
					<i className="bi bi-dash-lg" />
				</button>
				<button
					className="menu-bar-button "
					type="button"
					id="max-unmax-btn"
					onClick={maxUnmaxButton}
				>
					<i className="bi bi-fullscreen-exit" />
				</button>
				<button
					className="menu-bar-button menu-bar-button-exit"
					type="button"
					id="close-btn"
					onClick={closeButton}
				>
					<i className="bi bi-x-lg" />
				</button>
			</div>
			<div className="topGrabBar " />
			<nav className="navbar navbar-expand-lg navbar-spacing">
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavAltMarkup"
						aria-controls="navbarNavAltMarkup"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>
					<div
						className="collapse navbar-collapse"
						id="navbarNavAltMarkup"
					>
						<div>
							<Link className="navbar-text" to="/">
								Home
							</Link>
							<Link className="navbar-text" to="/search">
								Search
							</Link>
							<Link className="navbar-text" to="/library">
								Library
							</Link>
							<Link className="navbar-text" to="/events">
								Events
							</Link>
							<Link className="navbar-text" to="/debug">
								Debugger
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Header;
