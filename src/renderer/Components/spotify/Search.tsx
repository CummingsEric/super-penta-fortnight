import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import Playlist from 'renderer/Interfaces/Playlist';
import SongDisplay from './SongDisplay';

interface SearchInput {
	searchString: string;
}

const Search = () => {
	// Searched songs
	const [songs, setSongs] = useState<SpotifyTracksData[]>([]);

	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);
	const { spotifyAccessToken } = spotifyAuth;

	const getSongs = async (songName: string) => {
		// Get the song urls
		const tokenUrl = 'https://api.spotify.com/v1/search';
		const songSearchBody = {
			headers: {
				Authorization: `Bearer ${spotifyAccessToken?.authToken}`,
				'Content-Type': 'application/json',
			},
			params: {
				q: `track:${songName}`,
				type: 'track',
				limit: 10,
				market: 'US',
				offset: 0,
			},
		};
		const songURLs = await axios.get(tokenUrl, songSearchBody);

		// Use the urls to lookup data
		const songDataBody = {
			headers: {
				Authorization: `Bearer ${spotifyAccessToken?.authToken}`,
				'Content-Type': 'application/json',
			},
		};
		const songTracks: SpotifyTracksData[] = await (
			await axios.get(songURLs.data.tracks.href, songDataBody)
		).data.tracks.items;

		// Set state
		setSongs(songTracks);
	};

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
		await axios({
			url: tokenUrl,
			method: 'put',
			headers: {
				Authorization: `Bearer ${spotifyAccessToken?.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		});
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

	// Search bar
	const { register, handleSubmit } = useForm<SearchInput>();
	const onSubmit = ({ searchString }: SearchInput) => {
		getSongs(searchString);
	};

	// Nothing to do if no playlists
	if (library.length === 0) {
		return (
			<div>
				<h4>No playlists yet!</h4>
				<p>Create a playlist then come back</p>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-center pb-2">Search</h1>
			<div className="container">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="input-group mb-3">
						<input
							className="form-control"
							placeholder="Search for a song..."
							aria-label="Song"
							aria-describedby="searchbtn"
							{...register('searchString', {
								required: true,
								maxLength: 20,
							})}
						/>
						<input
							className="btn btn-primary"
							type="submit"
							id="searchbtn"
							value="Submit"
						/>
					</div>
				</form>
				<SongDisplay songs={songs} library={library} />
			</div>
		</div>
	);
};

export default Search;
