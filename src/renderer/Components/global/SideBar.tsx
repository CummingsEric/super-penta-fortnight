import { Link } from 'react-router-dom';

const SideBar = () => {
	const closeBtn = document.querySelector('#btn');

	const toggle = (event: any) => {
		const sidebar = document.querySelector('.sidebar');
		console.log('called', sidebar);
		if (sidebar) {
			sidebar.classList.toggle('open');
		}
	};

	return (
		<div className="sidebar">
			<div className="logo_content">
				<div className="logo">
					<i className="bi bi-music-note" />
					<div className="logo_name">Sona</div>
				</div>
				<i
					aria-label="toggle nav"
					role="button"
					className="bi bi-list"
					id="btn"
					onClick={toggle}
					onKeyDown={toggle}
					tabIndex={0}
				/>
			</div>
			<ul className="nav_list">
				<li>
					<Link to="/">
						<i className="bi bi-house" />
						<span className="links_name">Home</span>
					</Link>
					<span className="tooltip-cust">Home</span>
				</li>
				<li>
					<Link to="/search">
						<i className="bi bi-search" />
						<span className="links_name">Search</span>
					</Link>
					<span className="tooltip-cust">Search</span>
				</li>
				<li>
					<Link to="/library">
						<i className="bi bi-music-note-list" />
						<span className="links_name">Library</span>
					</Link>
					<span className="tooltip-cust">Library</span>
				</li>
				<li>
					<Link to="/events">
						<i className="bi bi-alarm" />
						<span className="links_name">Events</span>
					</Link>
					<span className="tooltip-cust">Events</span>
				</li>
				<li>
					<Link to="/debug">
						<i className="bi bi-bug" />
						<span className="links_name">Debugger</span>
					</Link>
					<span className="tooltip-cust">Debugger</span>
				</li>
			</ul>
			<div className="settings">
				<Link to="/settings">
					<i className="bi bi-gear" />
					<span className="links_name">Settings</span>
				</Link>
				<span className="tooltip-cust">Settings</span>
			</div>
		</div>
	);
};

export default SideBar;
