import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import Playlist from 'renderer/Interfaces/Playlist';
import { useDispatch } from 'react-redux';
import { addSong } from 'renderer/Store/library';

interface SongProps {
	songs: SpotifyTracksData[];
	library: Playlist[];
}

const SongDisplay = (props: SongProps) => {
	const { songs, library } = props;
	const dispatch = useDispatch();

	const addToPlaylist = (playlistId: string, song: SpotifyTracksData) => {
		dispatch(addSong({ song, playlistId }));
	};

	const songJSX = songs.map((e: SpotifyTracksData) => {
		const playlistItems = library.map((item) => {
			return (
				<li
					key={e.id + item.id}
					onClick={() => addToPlaylist(item.id, e)}
					aria-hidden="true"
				>
					<span className="dropdown-item">{item.name}</span>
				</li>
			);
		});

		return (
			<div className="d-flex pt-2" key={e.id}>
				<div className="flex-shrink-0">
					<img
						className="flex-shrink-0 me-2"
						title={e.album.name}
						src={e.album.images[2].url}
						alt={`${e.album.name}Artwork`}
					/>
				</div>
				<div className="flex-grow-1 ms-3 border-bottom border-opacity-50 border-light">
					<p className="pt-2 mb-0 small lh-sm">
						<strong className="d-block text-gray-dark">
							{e.name}
						</strong>
						<span>{e.artists[0].name}</span>
					</p>
				</div>
				<div />
				<div className="d-flex align-items-center border-bottom border-opacity-50 border-light">
					<div className="dropdown">
						<button
							className="btn btn-secondary dropdown-toggle"
							type="button"
							id="playlistAdd"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Add to playlist
						</button>
						<ul
							className="dropdown-menu"
							aria-labelledby="playlistAdd"
						>
							{playlistItems}
						</ul>
					</div>
				</div>
			</div>
		);
	});
	return <div>{songJSX}</div>;
};

export default SongDisplay;
