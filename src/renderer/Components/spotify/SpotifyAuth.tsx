import axios from 'axios';
import { useSelector } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';
import JSONPrinter from '../global/JSONPrinter';

const SpotifyAuth = () => {
	// Searched songs
	const spotifyAccessCode = useSelector(
		(state: MainState) => state.spotifyAccessCode.value
	);

	const spotifyAccessToken = useSelector(
		(state: MainState) => state.spotifyAccessToken.value
	);

	const spotifyRefreshToken = useSelector(
		(state: MainState) => state.spotifyRefreshToken.value
	);

	// Get library
	const library: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	// Play songs
	const playSong = async (playlistId: string) => {
		const playlist = library.find((e) => e.id === playlistId);
		if (playlist === undefined) return;
		const playlistSongs = Object.values(playlist.songs);
		const song =
			playlistSongs[Math.floor(Math.random() * playlistSongs.length)];
		const body = {
			uris: [song.uri],
			position_ms: 0,
		};
		const tokenUrl = 'https://api.spotify.com/v1/me/player/play';
		axios({
			url: tokenUrl,
			method: 'put',
			headers: {
				Authorization: `Bearer ${spotifyAccessToken.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		}).catch(() => {});
	};
	const playButtons = library.map((item) => {
		return (
			<li
				key={`${item.id}play`}
				onClick={() => playSong(item.id)}
				aria-hidden="true"
			>
				<span className="dropdown-item">{item.name}</span>
			</li>
		);
	});

	return (
		<div>
			<h1 className="text-center">Spotify Debugger</h1>
			<div className="pb-2">
				<h4>Test a playlist</h4>
				<div className="dropdown">
					<button
						className="btn btn-secondary dropdown-toggle"
						type="button"
						id="playlistAdd"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Shuffle
					</button>
					<ul className="dropdown-menu" aria-labelledby="playlistAdd">
						{playButtons}
					</ul>
				</div>
			</div>
			<div>
				<h4>Spotify Access Code</h4>
				<JSONPrinter data={spotifyAccessCode} />
				<h4>Spotify Access Token</h4>
				<JSONPrinter data={spotifyAccessToken} />
				<h4>Spotify Refresh Token</h4>
				<JSONPrinter data={{ spotifyRefreshToken }} />
			</div>
		</div>
	);
};

export default SpotifyAuth;
