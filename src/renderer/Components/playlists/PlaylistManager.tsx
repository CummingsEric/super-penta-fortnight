import { useDispatch, useSelector } from 'react-redux';

import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';

import { removeSong, removePlaylist } from 'renderer/Store/library';

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
				<button
					type="button"
					className="btn btn-outline-danger"
					onClick={() => remove(key)}
				>
					Remove
				</button>
			</div>
		</div>
	));

	return (
		<div>
			<h3>Playlist &apos;{name}&apos;</h3>
			<div className="pb-2">
				{numSongs === 0 ? 'No songs yet!' : songJsx}
			</div>
			<div>
				<button
					type="button"
					className="btn btn-danger"
					onClick={() => deleteP()}
				>
					Delete Playlist
				</button>
			</div>
		</div>
	);
};

export default PlaylistManager;
