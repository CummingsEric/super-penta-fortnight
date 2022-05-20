import { useDispatch, useSelector } from 'react-redux';

import MainState from 'renderer/Interfaces/MainState';
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

	const songJsx = Object.entries(songs).map(([key, entry]) => (
		<div className="d-flex pt-2" key={key}>
			<div className="flex-shrink-0">
				<img
					className="bd-placeholder-img flex-shrink-0 me-2 rounded"
					title={entry.album.name}
					src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_180e2c99172%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_180e2c99172%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.83984375%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
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
