import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLeagueData } from 'renderer/Store/leagueData';
import LeagueDataDisplay from '../league/LeagueDataDisplay';
import Header from './Header';
import SpotifyAuth from '../spotify/SpotifyAuth';

const Home = () => {
	return (
		<div>
			<Header />
			<h1>League Main Page</h1>
		</div>
	);
};

const League = () => {
	return (
		<div>
			<Header />
			<h1>League TEST Debugger</h1>
			<LeagueDataDisplay />
		</div>
	);
};

const Spotify = () => {
	return (
		<div>
			<Header />
			<h1>Spotify TEST Debugger</h1>
			<SpotifyAuth />
		</div>
	);
};

const Pages = () => {
	const dispatch = useDispatch();
	const update = () => {
		window.electron.ipcRenderer.sendMessage('get-league-data', ['request']);
		window.electron.ipcRenderer.once('get-league-data', (arg) => {
			if (arg !== null) {
				dispatch(setLeagueData(arg));
			}
		});
	};
	setInterval(update, 10000);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="/league" element={<League />} />
				<Route path="/spotify" element={<Spotify />} />
			</Routes>
		</Router>
	);
};

export default Pages;
