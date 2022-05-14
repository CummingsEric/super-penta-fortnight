import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import LeagueDataDisplay from './LeagueDataDisplay';
import Header from './Header';
import SpotifyAuth from './SpotifyAuth';

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

export default function App() {
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
}
