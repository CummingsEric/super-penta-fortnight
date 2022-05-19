import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => {
	return (
		<nav className="navbar navbar-expand-lg">
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
						<Link className="navbar-text" to="/home">
							Home
						</Link>
						<Link className="navbar-text" to="/league">
							Debugger
						</Link>
						<Link className="navbar-text" to="/spotify">
							Spotify
						</Link>
						<Link className="navbar-text" to="/library">
							Library
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
