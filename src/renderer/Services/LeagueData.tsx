import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export class LeagueClientData {
	url: string = 'https://127.0.0.1:2999/liveclientdata/allgamedata';

	async getData() {
		const instance = axios.create({
			httpsAgent: new window.agent({
				rejectUnauthorized: false,
			}),
		});

		try {
			const res = await axios.get(this.url);
			const { data } = res;
			if (res.status === 200) {
				return data;
			}
			return null;
		} catch (err) {
			return null;
		}
	}
}
