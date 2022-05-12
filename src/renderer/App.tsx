import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import LeagueDataDisplay from './Components/LeagueDataDisplay';
import Header from './Components/Header';
import SpotifyAuth from './Components/SpotifyAuth';

const Hello = () => {
	return (
		<div>
			<Header />
			<h1>League Main Page</h1>
		</div>
	);
};

const Test = () => {
	return (
		<div>
			<Header />
			<h1>League TEST Debugger</h1>
			<LeagueDataDisplay />
			<SpotifyAuth />
		</div>
	);
};

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Hello />} />
				<Route path="/debug" element={<Test />} />
			</Routes>
		</Router>
	);
}
