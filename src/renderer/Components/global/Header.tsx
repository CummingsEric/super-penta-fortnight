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
		</>
	);
};

export default Header;
