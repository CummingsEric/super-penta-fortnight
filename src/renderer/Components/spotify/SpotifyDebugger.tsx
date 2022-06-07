import { useSelector } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import JSONPrinter from '../global/JSONPrinter';

const SpotifyAuth = () => {
	// Spotify auth
	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);

	return (
		<div>
			<h1 className="text-center">Spotify Debugger</h1>
			<div className="container pt-4 pb-2">
				<h4>Spotify Auth</h4>
				<JSONPrinter data={spotifyAuth} />
			</div>
		</div>
	);
};

export default SpotifyAuth;
