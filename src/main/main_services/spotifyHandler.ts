import path from 'path';
import { app, BrowserWindow } from 'electron';
import SpotifyAccessCode from 'renderer/Interfaces/SpotifyAccessCode';

const getTokens = (event: any, arg: any) => {
	let authWindow: BrowserWindow | null = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		webPreferences: {
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../.erb/dll/preload.js'),
		},
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
	// 'will-navigate' is an event emitted when the window.location changes
	// newUrl should contain the tokens you need
	authWindow.webContents.on('will-navigate', (event_, newUrl) => {
		if (newUrl.includes('code')) {
			const token = newUrl.substring(
				newUrl.indexOf('=') + 1,
				newUrl.length
			);
			authWindow?.close();
			const data: SpotifyAccessCode = { authCode: token, used: false };

			event.reply('get-spotify-token', data);
		}
	});

	authWindow.on('closed', () => {
		authWindow = null;
	});
};

export default getTokens;
