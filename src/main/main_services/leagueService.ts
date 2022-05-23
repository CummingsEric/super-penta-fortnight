import https from 'https';
import axios from 'axios';
import LeagueResData from 'renderer/Interfaces/LeagueResData';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import staticData from './static.json';
import processData from './leagueHelper';

export default class LeagueService {
	url: string = 'https://127.0.0.1:2999/liveclientdata/allgamedata';

	lastUpdate: number = 0;

	async getData(): Promise<CurrentEvents | null> {
		const instance = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: false,
			}),
		});

		try {
			const res = await instance.get(this.url);
			const lolResData = res.data as LeagueResData;
			if (res.status === 200) {
				const lolEventDict = processData(lolResData, this.lastUpdate);
				this.lastUpdate = lolResData.gameData.gameTime;
				return lolEventDict;
			}
			return null;
		} catch (err) {
			// TODO: remove this
			// return staticData;
			return processData(staticData as LeagueResData, this.lastUpdate);
		}
	}
}
