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
import Playlist from 'renderer/Interfaces/Playlist';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import LeagueService from './main_services/leagueService';
import { findMaxEvent } from './main_services/leagueHelper';
import ConfigService from './main_services/configService';
import { authenticateUserFuncStart } from './main_services/spotifyHandler';
import SpotifyService from './main_services/spotifyService';

export default class AppUpdater {
	constructor() {
		log.transports.file.level = 'info';
		autoUpdater.logger = log;
		autoUpdater.checkForUpdatesAndNotify();
	}
}

let mainWindow: BrowserWindow | null = null;
const lcd = new LeagueService();
const cm = new ConfigService();
const qm = new SpotifyService(cm);

// ICP Handlers
ipcMain.on('ipc-example', async (event, arg) => {
	const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
	event.reply('ipc-example', msgTemplate('request sent from main process'));
});

// Authenticate the user with spotify
// ipcMain.on('get-spotify-token', async (event, arg) => {
// 	getAuthCode();
// });

// ipcMain.on('load-spotify-state', async (event, arg) => {
// 	const data = cm.loadConfig();
// 	event.reply('load-config', data);
// });

// ipcMain.on('save-spotify-state', async (event, arg) => {
// 	const config = arg;
// 	cm.setSpotifyAuth(config);
// });
const startSpotifyAuth = (_mainWindow: BrowserWindow) => {
	if (_mainWindow) {
		const initialAuth = cm.getSpotifyAuth();
		console.log('\n\ninitial auth state:', initialAuth, '\n\n');
		const newAuth = authenticateUserFuncStart(initialAuth, _mainWindow, cm);
	}
	setTimeout(startSpotifyAuth, 3540000, _mainWindow);
};

ipcMain.on('load-config', async (event, arg) => {
	const data = cm.loadConfig();
	event.reply('load-config', data);
});

ipcMain.on('save-config', async (event, arg) => {
	const config = arg;
	cm.setLibrary(config);
});

ipcMain.on('save-library', async (_event, arg) => {
	const library = arg as Playlist[];
	console.log(library);
	cm.setLibrary(library);
});

ipcMain.on('reset-config', async () => {
	cm.resetConfig();
});

ipcMain.on('save-events', async (_event, arg) => {
	cm.setEventMapping(arg[0]);
	cm.setPriority(arg[1]);
});

// Send client updated league data
ipcMain.on('get-league-data', async (event, arg) => {
	const data = await lcd.getData();
	// TODO: do we want to reply here?
	if (data === null) return;
	const maxPrio = findMaxEvent(data, cm.getPriority());
	if (maxPrio !== undefined) {
		qm.queueSongByEvent(maxPrio[0], maxPrio[1], data.updateTime);
	}
	event.reply('get-league-data', data);
});

// menu listeners
ipcMain.on('minimize', async (event, arg) => {
	if (mainWindow && mainWindow.minimizable) {
		// browserWindow.isMinimizable() for old electron versions
		mainWindow.minimize();
	}
});

ipcMain.on('max-unmax', async (event, arg) => {
	if (mainWindow) {
		if (mainWindow.isMaximized()) {
			mainWindow.unmaximize();
			event.reply('max-unmax', 'maximize');
		} else {
			mainWindow.maximize();
			event.reply('max-unmax', 'minimize');
		}
	}
});

ipcMain.on('close', async (event, arg) => {
	if (mainWindow) {
		mainWindow.close();
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
		frame: false,
	});

	mainWindow.loadURL(resolveHtmlPath('index.html'));

	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.maximize();
			mainWindow.show();
		}
		startSpotifyAuth(mainWindow);
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
