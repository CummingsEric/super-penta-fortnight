import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';

import { removeSong, removePlaylist } from 'renderer/Store/library';

interface PlaylistManagerProps {
	playlistId: string;
}

const PlaylistManager = (props: PlaylistManagerProps) => {
	const dispatch = useDispatch();
	const [editing, setEditing] = useState<boolean>(false);
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);
	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);
	const settings = useSelector((state: MainState) => state.settings.value);

	const { playlistId } = props;
	const playlist = libraryData.find((e) => e.id === playlistId);
	if (playlist === null || playlist === undefined) return <></>;
	const { name, songs } = playlist;
	const numSongs = playlist === undefined ? 0 : Object.keys(songs).length;

	const remove = (songId: string) => {
		dispatch(removeSong({ playlistId: playlist.id, songId }));
	};

	const deleteP = () => {
		dispatch(removePlaylist({ playlistId: playlist.id }));
	};

	// Play songs
	const play = async () => {
		if (playlist === undefined) return;
		const playlistSongs = Object.values(playlist.songs);
		if (playlistSongs.length === 0) return;
		const songURIs = playlistSongs.map((e) => e.uri);
		const body = {
			uris: songURIs,
			position_ms: 0,
		};
		let tokenUrl = 'https://api.spotify.com/v1/me/player/play';
		if (settings && settings.spotifyDevice) {
			tokenUrl = `${tokenUrl}?device_id=${settings.spotifyDevice.id}`;
		}
		axios({
			url: tokenUrl,
			method: 'put',
			headers: {
				Authorization: `Bearer ${spotifyAuth.spotifyAccessToken?.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		}).catch(() => {});
	};

	const songJsx = Object.entries(songs).map(([key, entry]) => (
		<div className="d-flex pt-2" key={key}>
			<div className="flex-shrink-0">
				<img
					className="flex-shrink-0 me-2"
					title={entry.album.name}
					src={entry.album.images[2].url}
					alt={`${entry.album.name}Artwork`}
				/>
			</div>
			<div className="flex-grow-1 ms-3 border-bottom">
				<p className="pt-2 mb-0 small lh-sm">
					<strong className="d-block text-gray-dark">
						{entry.name}
					</strong>
					<span>{entry.artists[0].name}</span>
				</p>
			</div>
			<div className="d-flex align-items-center border-bottom">
				<i
					className="bi bi-x clickable fs-5 p-1"
					onClick={() => remove(key)}
					aria-hidden="true"
				/>
			</div>
		</div>
	));

	return (
		<div>
			<div className="w-100 d-flex">
				<div className="flex-grow-1">
					<h3 className="m-0">{name}</h3>
				</div>
				<div className="d-flex align-items-center">
					<i
						className="bi bi-play clickable fs-3 px-1"
						onClick={play}
						aria-hidden="true"
					/>
					<i
						className="bi bi-pencil clickable fs-5 p-2 mx-2"
						onClick={() => setEditing(!editing)}
						aria-hidden="true"
					/>
					<i
						className="bi bi-trash clickable text-danger fs-5 p-2"
						onClick={deleteP}
						aria-hidden="true"
					/>
				</div>
			</div>
			<div className="py-3">
				{numSongs === 0 ? 'No songs yet!' : songJsx}
			</div>
		</div>
	);
};

export default PlaylistManager;
