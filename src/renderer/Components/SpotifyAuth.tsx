import axios from 'axios';
import { stringify } from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import { setSpotifyCode, clearSpotifyCode } from 'renderer/Store/spotifyCode';
import { setSpotifyToken } from '../Store/spotifyToken';

const SpotifyAuth = () => {
	const dispatch = useDispatch();
	const spotifyToken = useSelector((state: any) => state.spotifyToken.value);
	const spotifyCode = useSelector((state: any) => state.spotifyCode.value);

	const clearCode = () => {
		localStorage.clear();
		dispatch(clearSpotifyCode());
	};

	const getToken = () => {
		const tok = localStorage.getItem('spotify-access-code');
		if (tok !== undefined && tok != null) {
			dispatch(setSpotifyCode(String(tok)));
			return;
		}
		console.log('making spotify token request');
		window.electron.ipcRenderer.sendMessage('get-spotify-token', [
			'request',
		]);
	};

	const getAccessRefreshTokens = async () => {
		const authToken = btoa(
			`0c51a110dea445f49fbbed2d29d387c9:95b5363808b34b15ae831e3e0cc5f146`
		);
		const tokenUrl = 'https://accounts.spotify.com/api/token';
		const body = stringify({
			grant_type: 'authorization_code',
			code: spotifyCode,
			redirect_uri: encodeURI('https://google.com'),
		});
		try {
			const response = await axios.post(tokenUrl, body, {
				headers: {
					Authorization: `Basic ${authToken}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			if (response.status === 200) {
				dispatch(setSpotifyToken(response.data.access_token));
				return;
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
			dispatch(clearSpotifyCode());
			localStorage.clear();
			getToken();
		}
	};

	window.electron.ipcRenderer.once('get-spotify-token', (arg) => {
		if (arg != null) {
			localStorage.setItem('spotify-access-code', String(arg));
			dispatch(setSpotifyCode(String(arg)));
		}
	});

	return (
		<div>
			<button type="button" onClick={getToken}>
				Get Access Code
			</button>
			<div>{spotifyCode === null ? 'Token not set' : spotifyCode}</div>
			<div>
				<button type="button" onClick={getAccessRefreshTokens}>
					get Access Token
				</button>
			</div>
			<div>{spotifyToken === null ? 'Token not set' : spotifyToken}</div>
			<div>
				<button type="button" onClick={clearCode}>
					Clear Access Code
				</button>
			</div>
		</div>
	);
};

export default SpotifyAuth;
