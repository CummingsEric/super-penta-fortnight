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

	const getSongs = async () => {
		const tokenUrl = 'https://api.spotify.com/v1/search';

		const body = {
			headers: {
				Authorization: `Bearer ${spotifyAccessToken.authToken}`,
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
				Authorization: `Bearer ${spotifyAccessToken.authToken}`,
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
				Authorization: `Bearer ${spotifyAccessToken.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		});
	};

	const testFunc2 = () => {
		playSong();
	};

	return (
		<div>
			<div>
				<button type="button" onClick={testFunc2}>
					Play Song
				</button>
			</div>
			<div>
				<h3>Access Token</h3>
			</div>
			<div>
				{spotifyAccessToken === undefined
					? 'Token not set'
					: spotifyAccessToken.authToken}
			</div>
		</div>
	);
};

export default SpotifyAuth;
