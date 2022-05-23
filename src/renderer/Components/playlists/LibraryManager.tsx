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
	} = useForm<FormInput>();
	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const [playlistId, setPlaylist] = useState<string>('');
	const playlists = libraryData.map((e) => {
		return (
			<div key={e.id} className="pb-2">
				<strong>{e.name}</strong>
				<button
					type="button"
					onClick={() => setPlaylist(e.id)}
					className="btn btn-secondary mx-4"
				>
					Edit
				</button>
			</div>
		);
	});

	const onSubmit: SubmitHandler<FormInput> = (data: FormInput) => {
		const { playlistName } = data;
		dispatch(newPlaylist({ name: playlistName }));
		reset();
	};

	const save = () => {
		window.electron.ipcRenderer.sendMessage('save-config', libraryData);
	};

	return (
		<div>
			<h1 className="text-center pb-2">Library</h1>
			<div className="container">
				<div className="pb-2">
					<h3>Create a new playlist</h3>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="input-group mb-3">
							<input
								className="form-control"
								placeholder="New playlist name"
								aria-label="Song"
								// eslint-disable-next-line react/jsx-props-no-spreading
								{...register('playlistName', {
									required: true,
								})}
							/>
							{errors.playlistName && (
								<span>This field is required</span>
							)}
							<input
								className="btn btn-primary"
								type="submit"
								value="Create"
							/>
						</div>
					</form>
				</div>

				<div className="pb-2">
					<h3>All Playlists</h3>
					{libraryData.length === 0 ? 'No Playlists' : playlists}
				</div>
				<PlaylistManager playlistId={playlistId} />
			</div>
		</div>
	);
};

export default LibraryManager;
