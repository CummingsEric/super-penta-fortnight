/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { isCompositeComponent } from 'react-dom/test-utils';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { LeagueClientData } from './main_services/league_requests';

export default class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;
const lcd: LeagueClientData = new LeagueClientData();

// ICP Handlers
ipcMain.on('ipc-example', async (event, arg) => {
	const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
	console.log(msgTemplate(arg));
	event.reply('ipc-example', msgTemplate('request sent from main process'));
});

ipcMain.on('get-spotify-token', async (event, arg) => {
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
	authUrl += '&scope=user-read-playback-state,user-modify-playback-state';

	authWindow.loadURL(authUrl);
	authWindow.show();
	// 'will-navigate' is an event emitted when the window.location changes
	// newUrl should contain the tokens you need
	authWindow.webContents.on('will-navigate', function (event_, newUrl) {
		console.log(newUrl);
		if (newUrl.includes('code')) {
			const token = newUrl.substring(
				newUrl.indexOf('=') + 1,
				newUrl.length
			);
			authWindow?.close();
			let authUrl = 'https://accounts.spotify.com/authorize';
			authUrl += `?client_id=${clientId}`;
			authUrl += '&response_type=code';
			authUrl += `&redirect_uri=${uri}`;
			event.reply('get-spotify-token', token);
		}
		// More complex code to handle tokens goes here
	});

	authWindow.on('closed', function () {
		authWindow = null;
	});

	const msgTemplate = (pingPong: string) =>
		`IPC spotify request: ${pingPong}`;
	console.log(msgTemplate(arg));
	event.reply('ipc-example', msgTemplate('request recieved from render'));
});

ipcMain.on('get-league-data', async (event, arg) => {
	console.log('main  process has recieved request for league data');
	try {
		const data = await lcd.getData();
		event.reply('get-league-data', data);
	} catch (err) {
		console.log(err);
	}
});

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support');
	sourceMapSupport.install();
}

const isDebug =
	process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
	require('electron-debug')();
}

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log);
};

const createWindow = async () => {
	if (isDebug) {
		await installExtensions();
	}

	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, 'assets')
		: path.join(__dirname, '../../assets');

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728,
		icon: getAssetPath('icon.png'),
		webPreferences: {
			preload: app.isPackaged
				? path.join(__dirname, 'preload.js')
				: path.join(__dirname, '../../.erb/dll/preload.js'),
		},
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.show();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: 'deny' };
	});

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.whenReady()
	.then(() => {
		createWindow();
		app.on('activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});
	})
	.catch(console.log);
