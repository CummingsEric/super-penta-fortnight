import {
	MemoryRouter as Router,
	Routes,
	Route,
	Link,
	Outlet,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLeagueData } from 'renderer/Store/leagueData';
import { setLibrary } from 'renderer/Store/library';
import { setSettings } from 'renderer/Store/settings';
import ConfigFile from 'renderer/Interfaces/ConfigFile';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import { setAllEvents } from 'renderer/Store/eventData';
import { setSong } from 'renderer/Store/currSong';
import LibraryManager from '../playlists/LibraryManager';
import LeagueDataDisplay from '../league/LeagueDataDisplay';
import Header from './Header';
import Home from './Home';
import SpotifyAuth from '../spotify/SpotifyDebugger';
import EventManager from '../events/EventManager';
import ConfigDebugger from '../config/ConfigDebugger';
import Search from '../spotify/Search';
import ReduxViewer from './ReduxViewer';
import SelectDevice from '../settings/selectDevice';

const Debugger = () => {
	return (
		<div className="page-container">
			<div>
				<Link className="link-light" to="league">
					League Data
				</Link>
				<Link className="link-light" to="spotify">
					Spotify Auth
				</Link>
				<Link className="link-light" to="config">
					Config File
				</Link>
				<Link className="link-light" to="redux">
					Redux Viewer
				</Link>
			</div>
			<Outlet />
		</div>
	);
};

const Pages = () => {
	const dispatch = useDispatch();

	// Begin pinging the main process for league updates every 10 seconds
	const update = () => {
		window.electron.ipcRenderer.sendMessage('get-league-data', ['request']);
		window.electron.ipcRenderer.once('get-league-data', (arg: any) => {
			if (arg === null || typeof arg !== 'object') return;
			const data = arg.leagueData as CurrentEvents;
			const song = {
				songName: arg.songName,
				songEvent: arg.songEvent,
			};
			dispatch(setLeagueData(data));
			dispatch(setSong(song));
		});
	};
	setInterval(update, 5000);

	// Load the users config on startup
	window.electron.ipcRenderer.once('load-config', (arg: unknown) => {
		const config = arg as ConfigFile;
		if (config !== null) {
			dispatch(setLibrary(config.library));
			dispatch(setAllEvents(config.eventData));
			dispatch(setSettings(config.settings));
		}
	});
	window.electron.ipcRenderer.sendMessage('load-config', ['request']);

	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/search" element={<Search />} />
				<Route path="/library" element={<LibraryManager />} />
				<Route path="/events" element={<EventManager />} />
				<Route path="/debug" element={<Debugger />}>
					<Route path="league" element={<LeagueDataDisplay />} />
					<Route path="spotify" element={<SpotifyAuth />} />
					<Route path="config" element={<ConfigDebugger />} />
					<Route path="redux" element={<ReduxViewer />} />
				</Route>
				<Route path="/settings" element={<SelectDevice />} />
			</Routes>
		</Router>
	);
};

export default Pages;
