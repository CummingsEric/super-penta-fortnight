import { useDispatch } from 'react-redux';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';
import { setSpotifyAuth } from 'renderer/Store/spotifyAuth';

const SpotifyGlobalListener = () => {
	const dispatch = useDispatch();

	window.electron.ipcRenderer.on('send-spotify-token', (arg) => {
		if (arg != null) {
			const authData: SpotifyAuth = arg as SpotifyAuth;
			dispatch(setSpotifyAuth(authData));
		}
	});

	return <></>;
};
export default SpotifyGlobalListener;
