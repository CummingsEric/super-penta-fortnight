import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">
					Trash
				</a>
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
					<div className="navbar-nav">
						<Link to="/home">Home</Link>
						<Link to="/league">League</Link>
						<Link to="/spotify">Spotify</Link>
						<Link to="/library">Library</Link>
						<Link to="/events">Event</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
