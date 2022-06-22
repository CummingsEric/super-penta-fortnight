import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';
import { newPlaylist } from 'renderer/Store/library';

import PlaylistManager from './PlaylistManager';

type FormInput = {
	playlistName: string;
};

const LibraryManager = () => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
		clearErrors,
	} = useForm<FormInput>();
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const firstPlaylist = libraryData.length > 0 ? libraryData[0].id : '';
	const [playlistId, setPlaylist] = useState<string>(firstPlaylist);
	const playlists = libraryData.map((e) => {
		return (
			<div
				key={e.id}
				role="button"
				className="pb-2 pe-auto hov-under"
				onClick={() => setPlaylist(e.id)}
				aria-hidden="true"
			>
				<span className="">{e.name}</span>
			</div>
		);
	});

	const noPlaylistsJsx = (
		<div className="pb-2 pe-auto" aria-hidden="true">
			<span>No Playlists Yet</span>
		</div>
	);

	const onSubmit: SubmitHandler<FormInput> = (data: FormInput) => {
		const { playlistName } = data;
		if (libraryData.find((e) => e.name === playlistName) !== undefined) {
			setError('playlistName', { message: 'Duplicate playlist names' });
			return;
		}
		dispatch(newPlaylist({ name: playlistName }));
		reset();
	};

	return (
		<div>
			<h1 className="text-center pb-2">Library</h1>
			<div className="container">
				<div className="row">
					<div className="col-3">
						<div className="pb-3">
							<form
								className="me-2"
								onSubmit={handleSubmit(onSubmit)}
							>
								<input
									className={`form-control rounded-2 border-0 bg-dark text-white ${
										errors.playlistName && 'is-invalid'
									}`}
									placeholder="Create a new playlist"
									aria-label="Playlist Create"
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...register('playlistName', {
										required: true,
									})}
									onBlur={() => clearErrors()}
								/>
							</form>
						</div>
						<div className="bg-dark px-3 pt-2 rounded-2 me-2 playlist-container scrollbar-gradient">
							{libraryData.length === 0
								? noPlaylistsJsx
								: playlists}
						</div>
					</div>
					<div className="col-9">
						<PlaylistManager playlistId={playlistId} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default LibraryManager;
