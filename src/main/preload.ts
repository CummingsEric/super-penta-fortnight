import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const https = require('https');
const axios = require('axios');

export type Channels = 'ipc-example' | 'get-league-data' | 'get-spotify-token';

contextBridge.exposeInMainWorld('electron', {
	ipcRenderer: {
		sendMessage(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (
				_event: IpcRendererEvent,
				...args: unknown[]
			) => func(...args);
			ipcRenderer.on(channel, subscription);

			return () => ipcRenderer.removeListener(channel, subscription);
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
	},
});

contextBridge.exposeInMainWorld('leagueAPI', {
	getLeagueData: async () => {
		const instance = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		});

		instance
			.get('https://127.0.0.1:2999/liveclientdata/allgamedata')
			.then((data) => {
				console.log(data);
				if (data != null) {
					return data;
				}
				return null;
			})
			.catch((error) => console.log(error));
	},
});
