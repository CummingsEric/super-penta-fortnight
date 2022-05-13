import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import LeagueDataDisplay from './Components/LeagueDataDisplay';
import Header from './Components/Header';
import SpotifyAuth from './Components/SpotifyAuth';
import store from './Store/store';

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
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/league" element={<League />} />
					<Route path="/spotify" element={<Spotify />} />
				</Routes>
			</Router>
		</Provider>
	);
}
