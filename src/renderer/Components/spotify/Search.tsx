import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import Playlist from 'renderer/Interfaces/Playlist';
import SongDisplay from './SongDisplay';

interface SearchInput {
	searchSong: string;
	searchArtist: string;
}

const Search = () => {
	// Searched songs
	const [songs, setSongs] = useState<SpotifyTracksData[]>([]);

	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);
	const { spotifyAccessToken } = spotifyAuth;

	const getSongs = async (songName: string, artistName: string) => {
		// Get the song urls
		const tokenUrl = 'https://api.spotify.com/v1/search';
		let query = '';
		if (artistName && songName) {
			query = `track:${songName}+artist:${artistName}`;
		} else if (songName) {
			query = `track:${songName}`;
		} else if (artistName) {
			query = `artist:${artistName}`;
		} else {
			return;
		}
		console.log(query);
		const songSearchBody = {
			headers: {
				Authorization: `Bearer ${spotifyAccessToken?.authToken}`,
				'Content-Type': 'application/json',
			},
			params: {
				q: query,
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

	// Search bar
	const { register, handleSubmit } = useForm<SearchInput>();
	const onSubmit = ({ searchSong, searchArtist }: SearchInput) => {
		getSongs(searchSong, searchArtist);
	};

	return (
		<div>
			<h1 className="text-center pb-2">Search</h1>
			<div className="container">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="input-group ">
						<input
							className="form-control border-0 bg-dark text-white border-end border-secondary"
							placeholder="Search for a song..."
							aria-label="Song"
							aria-describedby="searchbtn"
							{...register('searchSong', {
								required: false,
								maxLength: 20,
							})}
						/>
						<input
							className="form-control border-0 bg-dark text-white border-start border-secondary border-opacity-75"
							placeholder="Find an artist..."
							aria-label="Song"
							aria-describedby="searchbtn"
							{...register('searchArtist', {
								required: false,
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
				{songs.length !== 0 && (
					<div className="bg-dark px-2 pb-2 mt-3 rounded-2 song-display">
						<SongDisplay songs={songs} library={library} />
					</div>
				)}
			</div>
		</div>
	);
};

export default Search;
