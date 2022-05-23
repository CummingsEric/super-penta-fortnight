import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLeagueData } from 'renderer/Store/leagueData';
import { setLibrary } from 'renderer/Store/library';
import { setPriority } from 'renderer/Store/eventPriority';
import { setMapping } from 'renderer/Store/eventMapping';
import ConfigFile from 'renderer/Interfaces/ConfigFile';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import LibraryManager from '../playlists/LibraryManager';
import LeagueDataDisplay from '../league/LeagueDataDisplay';
import Header from './Header';
import Home from './Home';
import SpotifyAuth from '../spotify/SpotifyAuth';
import EventManager from '../events/EventManager';
import ConfigDebugger from '../config/ConfigDebugger';
import Search from '../spotify/Search';

const League = () => {
	return (
		<div className="page-container">
			<LeagueDataDisplay />
		</div>
	);
};

const Spotify = () => {
	return (
		<div className="page-container">
			<h1>Spotify TEST Debugger</h1>
			<SpotifyAuth />
		</div>
	);
};

const Pages = () => {
	const dispatch = useDispatch();

	// Begin pinging the main process for league updates every 10 seconds
	const update = () => {
		window.electron.ipcRenderer.sendMessage('get-league-data', ['request']);
		window.electron.ipcRenderer.once('get-league-data', (arg) => {
			const leagueData = arg as CurrentEvents;
			if (arg !== null) {
				dispatch(setLeagueData(leagueData));
			}
		});
	};
	setInterval(update, 5000);

	// Load the users config on startup
	window.electron.ipcRenderer.once('load-config', (arg: unknown) => {
		const config = arg as ConfigFile;
		if (config !== null) {
			dispatch(setLibrary(config.library));
			dispatch(setMapping(config.eventPlaylistMappings));
			dispatch(setPriority(config.priorities));
		}
	});
	window.electron.ipcRenderer.sendMessage('load-config', ['request']);

	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="/league" element={<League />} />
				<Route path="/spotify" element={<Spotify />} />
				<Route path="/search" element={<Search />} />
				<Route path="/library" element={<LibraryManager />} />
				<Route path="/events" element={<EventManager />} />
				<Route path="/config" element={<ConfigDebugger />} />
			</Routes>
		</Router>
	);
};

export default Pages;
