import axios from 'axios';
import { stringify } from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';
import SpotifyAccessToken from 'renderer/Interfaces/SpotifyAccessToken';
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
		(state: MainState) => state.spotifyAccessToken.value
	);
	const spotifyAccessCode = useSelector(
		(state: MainState) => state.spotifyAccessCode.value
	);
	const spotifyRefreshToken = useSelector(
		(state: MainState) => state.spotifyRefreshToken.value
	);

	let localSpotifyAccessCode: SpotifyAccessCode;
	let localSpotifyAccessToken: SpotifyAccessToken;
	let localSpotifyRefreshToken: string;
	// const spotifyCode = useSelector((state: any) => state.spotifyCode.value);
	const getAccessRefreshTokens = async (
		localSpotifyAccessCodeIn: SpotifyAccessCode,
		localSpotifyRefreshTokenIn: string
	) => {
		console.log(localSpotifyAccessCodeIn, localSpotifyRefreshTokenIn);
		const authToken = btoa(
			`0c51a110dea445f49fbbed2d29d387c9:95b5363808b34b15ae831e3e0cc5f146`
		);
		const tokenUrl = 'https://accounts.spotify.com/api/token';
		let body = {};
		// set the body based on if the access token is comming from AC or RT
		if (localSpotifyRefreshTokenIn === undefined) {
			console.log('requesting from new access code');
			body = stringify({
				grant_type: 'authorization_code',
				code: localSpotifyAccessCodeIn.authCode,
				redirect_uri: encodeURI('https://google.com'),
			});
		} else {
			console.log('requesting from refresh token');
			body = stringify({
				grant_type: 'refresh_token',
				refresh_token: localSpotifyRefreshTokenIn,
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
				localSpotifyAccessToken = {
					authToken: response.data.access_token,
					expirationMS:
						new Date().getTime() + 1000 * response.data.expires_in,
				};
				if (response.data.refresh_token) {
					localSpotifyRefreshToken = response.data.refresh_token;
				}
				return;
			}
		} catch (err) {
			console.log(err);
			// dispatch(clearSpotifyAccessCode());
			// dispatch(clearSpotifyRefreshToken());
		}
	};

	// function in charge of making sure the user is authenticated
	const authenticateUser = () => {
		const time = new Date().getTime();
		// check for valid access token
		if (
			localSpotifyAccessToken &&
			localSpotifyAccessToken.authToken &&
			time < localSpotifyAccessToken.expirationMS
		) {
			// there is already an active access token
			console.log(
				'Token expires in:',
				(localSpotifyAccessToken.expirationMS - time) / 1000,
				'seconds'
			);
			return;
		}
		console.log(localSpotifyAccessToken);
		// check for refresh token
		if (localSpotifyRefreshToken) {
			console.log(localSpotifyRefreshToken);
			getAccessRefreshTokens(
				localSpotifyAccessCode,
				localSpotifyRefreshToken
			);
			// authenticateUser();
			return;
		}
		// check if there is a spotify auth code that is unused
		console.log(localSpotifyAccessCode);
		if (localSpotifyAccessCode && !localSpotifyAccessCode.used) {
			// make the request for spotify access token
			console.log('valid code found');
			getAccessRefreshTokens(
				localSpotifyAccessCode,
				localSpotifyRefreshToken
			);
			// authenticateUser();
			return;
		}

		// if both of these fail, we need to request an accesscode and recall authenticate user
		console.log(`need an access code at ${time}`);
		window.electron.ipcRenderer.sendMessage('get-spotify-token', [
			'request',
		]);
	};

	window.electron.ipcRenderer.once('get-spotify-token', (arg) => {
		if (arg != null) {
			// localStorage.setItem('spotify-access-code', String(arg));
			// dispatch(setSpotifyAccessCode(arg));
			localSpotifyAccessCode = arg as SpotifyAccessCode;
			console.log('set local access code as', localSpotifyAccessCode);
			authenticateUser();
		}
	});

	const getSongs = async () => {
		const tokenUrl = 'https://api.spotify.com/v1/search';

		const body = {
			headers: {
				Authorization: `Bearer ${localSpotifyAccessToken.authToken}`,
				'Content-Type': 'application/json',
			},
			params: {
				q: 'track:Thunderstruck',
				type: 'track',
				limit: 10,
				market: 'US',
				offset: 0,
			},
		};

		const response = await axios.get(tokenUrl, body);
		console.log(response.data.tracks.href);

		const bodyTwo = {
			headers: {
				Authorization: `Bearer ${localSpotifyAccessToken.authToken}`,
				'Content-Type': 'application/json',
			},
		};

		const responseTwo = await axios.get(response.data.tracks.href, bodyTwo);
		console.log(responseTwo.data.tracks.items);
	};

	const playSong = async () => {
		const body = {
			uris: ['spotify:track:57bgtoPSgt236HzfBOd8kj'],
			position_ms: 0,
		};
		const tokenUrl = 'https://api.spotify.com/v1/me/player/play';
		await axios({
			url: tokenUrl,
			method: 'put',
			headers: {
				Authorization: `Bearer ${localSpotifyAccessToken.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		});
	};

	const testFunc = () => {
		authenticateUser();
	};

	const testFunc2 = () => {
		playSong();
	};

	return (
		<div>
			<div>
				<button type="button" onClick={testFunc}>
					Authenticate User
				</button>
			</div>
			<div>
				<button type="button" onClick={testFunc2}>
					Play Song
				</button>
			</div>
			<div>
				<h3>Access Code</h3>
			</div>
			<div>
				{spotifyAccessCode === undefined
					? 'Token not set'
					: spotifyAccessCode.authCode}
			</div>
			<div>
				<h3>Access Token</h3>
			</div>
			<div>
				{spotifyAccessToken === undefined
					? 'Token not set'
					: spotifyAccessToken.authToken}
			</div>
			<div>
				<h3>Refresh Token</h3>
			</div>
			<div>
				{spotifyRefreshToken === null
					? 'Token not set'
					: spotifyRefreshToken}
			</div>
		</div>
	);
};

export default SpotifyAuth;
