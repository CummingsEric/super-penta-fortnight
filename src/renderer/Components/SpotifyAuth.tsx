import { useState } from 'react';
import { setFlagsFromString } from 'v8';

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
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: btoa(
					'0c51a110dea445f49fbbed2d29d387c9' +
						':' +
						'95b5363808b34b15ae831e3e0cc5f146'
				),
			},
			body: JSON.stringify({
				grant_type: 'authorization_code',
				code: token,
				redirect_uri: encodeURI('https://google.com'),
			}),
		};
		fetch('https://accounts.spotify.com/api/token', requestOptions)
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch(null);
		console.log('changing song');
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
