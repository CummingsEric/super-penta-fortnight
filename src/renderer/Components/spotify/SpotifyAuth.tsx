import axios from 'axios';
import { stringify } from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import {
	setSpotifyAccessCode,
	clearSpotifyAccessCode,
} from 'renderer/Store/spotifyAccessCode';
import {
	setSpotifyRefreshToken,
	clearSpotifyRefreshToken,
} from '../../Store/spotifyRefreshToken';
import { setSpotifyAccessToken } from '../../Store/spotifyAccessToken';

const SpotifyAuth = () => {
	const dispatch = useDispatch();
	const spotifyAccessToken = useSelector(
		(state: any) => state.spotifyAccessToken.value
	);
	const spotifyAccessCode = useSelector(
		(state: any) => state.spotifyAccessCode.value
	);
	const spotifyRefreshToken = useSelector(
		(state: any) => state.spotifyRefreshToken.value
	);
	// const spotifyCode = useSelector((state: any) => state.spotifyCode.value);

	const clearCode = () => {
		localStorage.clear();
		dispatch(clearSpotifyAccessCode());
	};

	const getCode = () => {
		// const tok = localStorage.getItem('spotify-access-code');
		// if (tok !== undefined && tok != null) {
		//	dispatch(setSpotifyAccessCode(String(tok)));
		//	return;
		// }
		console.log('making spotify token request');
		window.electron.ipcRenderer.sendMessage('get-spotify-token', [
			'request',
		]);
	};

	window.electron.ipcRenderer.once('get-spotify-token', (arg) => {
		if (arg != null) {
			localStorage.setItem('spotify-access-code', String(arg));
			dispatch(setSpotifyAccessCode(String(arg)));
		}
	});

	const getAccessRefreshTokens = async () => {
		const authToken = btoa(
			`0c51a110dea445f49fbbed2d29d387c9:95b5363808b34b15ae831e3e0cc5f146`
		);
		const tokenUrl = 'https://accounts.spotify.com/api/token';
		let body = {};
		if (spotifyRefreshToken === null) {
			console.log('requesting from new access code');
			body = stringify({
				grant_type: 'authorization_code',
				code: spotifyAccessCode,
				redirect_uri: encodeURI('https://google.com'),
			});
		} else {
			console.log('requesting from refresh token');
			body = stringify({
				grant_type: 'refresh_token',
				refresh_token: spotifyRefreshToken,
			});
		}
		try {
			const response = await axios.post(tokenUrl, body, {
				headers: {
					Authorization: `Basic ${authToken}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			if (response.status === 200) {
				console.log(response.data);
				dispatch(setSpotifyAccessToken(response.data.access_token));
				if (response.data.refresh_token) {
					dispatch(
						setSpotifyRefreshToken(response.data.refresh_token)
					);
				}
				return;
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
			dispatch(clearSpotifyAccessCode());
			dispatch(clearSpotifyRefreshToken());
			localStorage.clear();
			getCode();
		}
	};

	return (
		<div>
			<button type="button" onClick={getCode}>
				Get Access Code
			</button>
			<div>
				{spotifyAccessCode === null
					? 'Token not set'
					: spotifyAccessCode}
			</div>
			<div>
				<button type="button" onClick={getAccessRefreshTokens}>
					get Access Token
				</button>
			</div>
			<div>
				{spotifyAccessToken === null
					? 'Token not set'
					: spotifyAccessToken}
			</div>
			<div>
				<h3>Refresh Token</h3>
			</div>
			<div>
				{spotifyRefreshToken === null
					? 'Token not set'
					: spotifyRefreshToken}
			</div>
			<div>
				<button type="button" onClick={clearCode}>
					Clear Access Code
				</button>
			</div>
		</div>
	);
};

export default SpotifyAuth;
