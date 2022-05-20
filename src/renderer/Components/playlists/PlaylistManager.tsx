import { useDispatch, useSelector } from 'react-redux';

import MainState from 'renderer/Interfaces/MainState';
import CurrentEvents from 'renderer/Interfaces/CurrentEvents';
import Playlist from 'renderer/Interfaces/Playlist';

import { removeSong, removePlaylist } from 'renderer/Store/playlistData';

interface PlaylistManagerProps {
	playlistId: string;
}

const PlaylistManager = (props: PlaylistManagerProps) => {
	const dispatch = useDispatch();
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

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

	const songJsx = Object.keys(songs).map((key: string) => (
		<li key={key}>
			<span>
				{key} : {String(songs[key as keyof CurrentEvents].name)}
			</span>
			<button type="button" onClick={() => remove(key)}>
				Remove Song
			</button>
		</li>
	));

	return (
		<div>
			<h3>Playlist {name}</h3>
			{numSongs === 0 ? 'No songs yet!' : songJsx}
			<button
				type="button"
				className="btn btn-danger"
				onClick={() => deleteP()}
			>
				Delete Playlist
			</button>
		</div>
	);
};

export default PlaylistManager;
