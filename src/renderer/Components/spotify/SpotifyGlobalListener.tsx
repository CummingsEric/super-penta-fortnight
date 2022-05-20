import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';
import { useDispatch } from 'react-redux';
import { setSpotifyAccessToken } from 'renderer/Store/spotifyAccessToken';

const SpotifyGlobalListener = () => {
	const dispatch = useDispatch();

	window.electron.ipcRenderer.on('send-spotify-token', (arg) => {
		console.log('arg recieved int he global listener:', arg);
		if (arg != null) {
			console.log('set local access token from store');
			const authData: SpotifyAccessCode = arg as SpotifyAccessCode;
			dispatch(setSpotifyAccessToken(authData));
		}
	});

	return <></>;
};
export default SpotifyGlobalListener;
