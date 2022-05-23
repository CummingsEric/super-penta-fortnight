import { BrowserWindow } from 'electron';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';
import { stringify } from 'qs';
import axios from 'axios';
import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';
import ConfigService from './configService';

const getAccessRefreshTokens = (
	authData: SpotifyAuth,
	mainWindow: BrowserWindow,
	cs: ConfigService
): SpotifyAuth => {
	const authToken = btoa(
		`0c51a110dea445f49fbbed2d29d387c9:95b5363808b34b15ae831e3e0cc5f146`
	);
	const tokenUrl = 'https://accounts.spotify.com/api/token';
	let body = {};
	let requestMethod = 'refresh';
	if (authData.spotifyAccessCode === undefined) {
		console.log('oh no from the reducer');
		return authData;
	}
	// set the body based on if the access token is comming from AC or RT
	if (authData.spotifyRefreshToken === undefined) {
		body = stringify({
			grant_type: 'authorization_code',
			code: authData.spotifyAccessCode.authCode,
			redirect_uri: encodeURI('https://google.com'),
		});
		requestMethod = 'code';
	} else {
		body = stringify({
			grant_type: 'refresh_token',
			refresh_token: authData.spotifyRefreshToken,
		});
	}

	axios
		.post(tokenUrl, body, {
			headers: {
				Authorization: `Basic ${authToken}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then((response) => {
			if (response.status === 200) {
				const payload: SpotifyAuth = {
					spotifyAccessCode: authData.spotifyAccessCode,
					spotifyAccessToken: undefined,
					spotifyRefreshToken: authData.spotifyRefreshToken,
				};

				if (
					payload.spotifyAccessCode !== undefined &&
					requestMethod === 'code'
				) {
					payload.spotifyAccessCode.used = true;
				}
				payload.spotifyAccessToken = {
					authToken: response.data.access_token,
					expirationMS:
						new Date().getTime() + 1000 * response.data.expires_in,
				};
				if (response.data.refresh_token) {
					payload.spotifyRefreshToken = response.data.refresh_token;
				}
				console.log('\n\nsending token \n\n');
				mainWindow.webContents.send('send-spotify-token', payload);
				cs.setSpotifyAuth(payload);
				return payload;
			}
			return authData;
		})
		.catch((err) => {
			console.log(err);
			return authData;
		});
	return authData;
};

export const authenticateUserFuncEnd = (
	authData: SpotifyAuth,
	mainWindow: BrowserWindow,
	cs: ConfigService
): SpotifyAuth => {
	const time = new Date().getTime();
	// check for refresh token
	if (authData.spotifyRefreshToken) {
		return getAccessRefreshTokens(authData, mainWindow, cs);
	}
	// check if there is a spotify auth code that is unused
	if (
		authData.spotifyAccessCode !== undefined &&
		!authData.spotifyAccessCode.used
	) {
		// make the request for spotify access token
		return getAccessRefreshTokens(authData, mainWindow, cs);
	}
	// if both of these fail, we need to request an accesscode and recall authenticate user
	console.log('something has gone horribly wrong');
	return authData;
};

export const getAuthCode = (
	mainWindow: BrowserWindow,
	cs: ConfigService
): SpotifyAuth => {
	let authWindow: BrowserWindow | null = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
	});

	const clientId = '0c51a110dea445f49fbbed2d29d387c9';
	const uri = encodeURI('https://google.com');

	let authUrl = 'https://accounts.spotify.com/authorize';
	authUrl += `?client_id=${clientId}`;
	authUrl += '&response_type=code';
	authUrl += `&redirect_uri=${uri}`;
	authUrl += '&show_dialog=true';
	authUrl += '&scope=user-read-playback-state user-modify-playback-state';

	authWindow.loadURL(authUrl);
	authWindow.show();

	authWindow.on('closed', () => {
		authWindow = null;
	});
	// 'will-navigate' is an event emitted when the window.location changes
	// newUrl should contain the tokens you need
	const newAuthData: SpotifyAuth = {
		spotifyAccessCode: undefined,
		spotifyAccessToken: undefined,
		spotifyRefreshToken: undefined,
	};
	authWindow.webContents.on('will-navigate', (_event_, newUrl) => {
		if (newUrl.includes('code')) {
			const token = newUrl.substring(
				newUrl.indexOf('=') + 1,
				newUrl.length
			);
			authWindow?.close();
			const data: SpotifyAccessCode = { authCode: token, used: false };
			newAuthData.spotifyAccessCode = data;
			return authenticateUserFuncEnd(newAuthData, mainWindow, cs);
		}
		return authenticateUserFuncEnd(newAuthData, mainWindow, cs);
	});

	return newAuthData;
};

export const authenticateUserFuncStart = (
	authData: SpotifyAuth,
	mainWindow: BrowserWindow,
	cs: ConfigService
): SpotifyAuth => {
	const time = new Date().getTime();
	// check for refresh token
	if (authData.spotifyRefreshToken) {
		return getAccessRefreshTokens(authData, mainWindow, cs);
	}
	// check if there is a spotify auth code that is unused
	if (
		authData.spotifyAccessCode !== undefined &&
		!authData.spotifyAccessCode.used
	) {
		// make the request for spotify access token
		return getAccessRefreshTokens(authData, mainWindow, cs);
	}
	// if both of these fail, we need to request an accesscode and recall authenticate user
	return getAuthCode(mainWindow, cs);
};
