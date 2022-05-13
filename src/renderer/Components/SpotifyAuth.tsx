import { useState } from 'react';
import { setFlagsFromString } from 'v8';
import axios from 'axios';
import { stringify } from 'qs';

const SpotifyAuth = () => {
	const [token, setToken] = useState('token-not-set');
	const [accessToken, setAccessToken] = useState('token-not-set');

	const getToken = () => {
		console.log('making spotify token request');
		window.electron.ipcRenderer.sendMessage('get-spotify-token', [
			'request',
		]);
	};

	const getAccessRefreshTokens = () => {
		const authToken = btoa(
			`0c51a110dea445f49fbbed2d29d387c9:95b5363808b34b15ae831e3e0cc5f146`
		);
		const tokenUrl = 'https://accounts.spotify.com/api/token';
		const body = stringify({
			grant_type: 'authorization_code',
			code: token,
			redirect_uri: encodeURI('https://google.com'),
		});
		axios
			.post(tokenUrl, body, {
				headers: {
					Authorization: `Basic ${authToken}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			.then((response) => {
				console.log(response);
				console.log(response.data.access_token);
				setAccessToken(response.data.access_token);
				return null;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	window.electron.ipcRenderer.once('get-spotify-token', (arg) => {
		// eslint-disable-next-line no-console
		console.log(arg);
		if (arg != null) {
			setToken(String(arg));
		}
	});

	return (
		<div>
			<button type="button" onClick={getToken}>
				Get Access Code
			</button>
			<div>{token}</div>
			<div>
				<button type="button" onClick={getAccessRefreshTokens}>
					get Access Token
				</button>
			</div>
			<div>{accessToken}</div>
		</div>
	);
};

export default SpotifyAuth;
