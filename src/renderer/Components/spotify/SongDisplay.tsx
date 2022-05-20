import SpotifyTracksData from 'renderer/Interfaces/SpotifyTracksData';
import Playlist from 'renderer/Interfaces/Playlist';
import { useDispatch } from 'react-redux';
import { addSong } from 'renderer/Store/playlistData';

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
						className="bd-placeholder-img flex-shrink-0 me-2 rounded"
						title={e.album.name}
						src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_180e2c99172%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_180e2c99172%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.83984375%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
						alt={`${e.album.name}Artwork`}
					/>
				</div>
				<div className="flex-grow-1 ms-3 border-bottom">
					<p className="pt-2 mb-0 small lh-sm">
						<strong className="d-block text-gray-dark">
							{e.name}
						</strong>
						<span>{e.artists[0].name}</span>
					</p>
				</div>
				<div className="d-flex align-items-center border-bottom">
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
