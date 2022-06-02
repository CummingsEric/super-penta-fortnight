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
		reset,
		formState: { errors },
		clearErrors,
	} = useForm<FormInput>();
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const [playlistId, setPlaylist] = useState<string>('');
	const playlists = libraryData.map((e) => {
		return (
			<div
				key={e.id}
				role="button"
				className="pb-2 pe-auto hov-under"
				onClick={() => setPlaylist(e.id)}
				aria-hidden="true"
			>
				<strong className="">{e.name}</strong>
			</div>
		);
	});

	const onSubmit: SubmitHandler<FormInput> = (data: FormInput) => {
		const { playlistName } = data;
		dispatch(newPlaylist({ name: playlistName }));
		reset();
	};

	return (
		<div className="page-container">
			<h1 className="text-center pb-2">Library</h1>
			<div className="container-fluid">
				<div className="row">
					<div className="col-3">
						<div className="pb-3">
							<form onSubmit={handleSubmit(onSubmit)}>
								<input
									className={`form-control rounded-0 border-0 bg-dark text-white ${
										errors.playlistName && 'is-invalid'
									}`}
									placeholder="Create a new playlist"
									aria-label="Song"
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...register('playlistName', {
										required: true,
									})}
									onBlur={() => clearErrors()}
								/>
							</form>
						</div>
						<div>
							{libraryData.length === 0
								? 'No Playlists'
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
