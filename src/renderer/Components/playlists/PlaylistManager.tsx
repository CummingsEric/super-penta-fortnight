import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';

import { removeSong, removePlaylist, changeName } from 'renderer/Store/library';
import ImportPlaylist from './ImportPlaylist';

interface PlaylistManagerProps {
	playlistId: string;
}

type FormInput = {
	playlistName: string;
};

const PlaylistManager = (props: PlaylistManagerProps) => {
	const dispatch = useDispatch();
	const { register, handleSubmit, reset, setValue } = useForm<FormInput>();

	const [editing, setEditing] = useState<boolean>(false);
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);
	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);
	const settings = useSelector((state: MainState) => state.settings.value);

	const { playlistId } = props;
	const playlist = libraryData.find((e) => e.id === playlistId);

	useEffect(() => {
		setEditing(false);
	}, [playlistId]);

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
			offset: {
				position: 0,
			},
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
			<div className="flex-grow-1 ms-3 border-bottom border-opacity-50 border-light">
				<p className="pt-2 mb-0 small lh-sm">
					<strong className="d-block text-gray-dark">
						{entry.name}
					</strong>
					<span>{entry.artists[0].name}</span>
				</p>
			</div>
			<div className="d-flex align-items-center border-bottom border-opacity-50 border-light me-4 pe-2">
				<i
					className="bi bi-x clickable fs-5 p-1"
					onClick={() => remove(key)}
					aria-hidden="true"
				/>
			</div>
		</div>
	));

	const noSongsJsx = (
		<>
			<span>Add a song on the</span>
			<Link className="link-light px-1" to="/search">
				search
			</Link>
			<span>
				page or{' '}
				<span
					data-bs-toggle="modal"
					data-bs-target="#importPlaylist"
					aria-hidden="true"
					className="clickable underline"
				>
					<u>import</u>
				</span>{' '}
				a Spotify playlist.
			</span>
		</>
	);

	const onSubmit: SubmitHandler<FormInput> = (data: FormInput) => {
		const { playlistName } = data;
		reset();
		setEditing(false);
		if (name === playlistName) return;
		dispatch(changeName({ playlistName, playlistId }));
	};

	const editBtn = () => {
		if (!editing) {
			setValue('playlistName', name);
			setEditing(!editing);
		} else {
			handleSubmit(onSubmit)();
		}
	};

	const nameEditorJsx = (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h3 className="m-0 border-bottom">
				<input
					type="text"
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					{...register('playlistName', {
						required: true,
					})}
					className="bg-dark input-hidden m-0 p-0 line-height-40"
				/>
			</h3>
		</form>
	);

	return (
		<div className="bg-dark rounded-2 py-2 px-3">
			<div className="w-100 d-flex">
				<div className="flex-grow-1">
					{editing ? (
						nameEditorJsx
					) : (
						<h3 className="m-0 p-0 line-height-40">{name}</h3>
					)}
				</div>
				<div className="d-flex align-items-center">
					<i
						className="bi bi-play clickable fs-3 px-1 ms-2"
						onClick={play}
						aria-hidden="true"
					/>
					<i
						className="bi bi-box-arrow-in-down clickable fs-5 p-2 mx-2"
						data-bs-toggle="modal"
						data-bs-target="#importPlaylist"
						aria-hidden="true"
					/>
					<i
						className="bi bi-pencil clickable fs-5 p-2 mx-2"
						onClick={editBtn}
						aria-hidden="true"
					/>
					<i
						className="bi bi-trash clickable text-danger fs-5 p-2"
						onClick={deleteP}
						aria-hidden="true"
					/>
				</div>
			</div>
			<div className="scrollbar-gradient my-3 song-display">
				{numSongs === 0 ? noSongsJsx : songJsx}
			</div>
			<ImportPlaylist spotifyAuth={spotifyAuth} playlistId={playlistId} />
		</div>
	);
};

export default PlaylistManager;
