import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import MainState from 'renderer/Interfaces/MainState';
import Playlist from 'renderer/Interfaces/Playlist';
import { newPlaylist, setLibrary } from 'renderer/Store/playlistData';

import PlaylistManager from './PlaylistManager';

type FormInput = {
	example: string;
	exampleRequired: string;
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
		(state: MainState) => state.libraryData.value
	);

	const [playlistId, setPlaylist] = useState<string>('');
	const playlists = libraryData.map((e) => {
		return (
			<div key={e.id}>
				<span>{e.name}</span>
				<button type="button" onClick={() => setPlaylist(e.id)}>
					Edit
				</button>
			</div>
		);
	});

	const onSubmit: SubmitHandler<FormInput> = (data) => {
		dispatch(newPlaylist({ name: data.exampleRequired }));
		reset();
	};

	const load = () => {
		window.electron.ipcRenderer.once('load-config', (arg: any) => {
			if (arg !== null) {
				dispatch(setLibrary(arg.library));
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
	};

	const save = () => {
		window.electron.ipcRenderer.sendMessage('save-config', libraryData);
	};

	return (
		<div>
			<h1>Library</h1>
			<div>
				<h3>Config</h3>
				<button type="button" onClick={() => load()}>
					Load from config
				</button>
				<button type="button" onClick={() => save()}>
					Save
				</button>
			</div>
			<div>
				<h3>Create a new playlist</h3>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<input
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...register('exampleRequired', { required: true })}
						/>
						{errors.exampleRequired && (
							<span>This field is required</span>
						)}
					</div>
					<div>
						<input type="submit" value="Create new Playlist" />
					</div>
				</form>
			</div>

			<div>
				<h3>All Playlists</h3>
				{libraryData.length === 0 ? 'No Playlists' : playlists}
			</div>
			<PlaylistManager playlistId={playlistId} />
		</div>
	);
};

export default LibraryManager;
