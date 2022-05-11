const https = require('https');
const axios = require('axios');

// eslint-disable-next-line import/prefer-default-export
export class SpotifyAuth {
  url: string = 'https://127.0.0.1:2999/liveclientdata/allgamedata';

  async getToken() {
    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    try {
      const res = await instance.get(this.url);
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
