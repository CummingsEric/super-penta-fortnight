import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import SpotifyAuth from 'renderer/Interfaces/SpotifyAuth';

import { addSongs } from 'renderer/Store/library';

interface ImportPlaylistProps {
	playlistId: string;
	spotifyAuth: SpotifyAuth;
}

type FormInput = {
	spotifyURL: string;
};

const ImportPlaylist = (props: ImportPlaylistProps) => {
	const dispatch = useDispatch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		clearErrors,
		setError,
	} = useForm<FormInput>();

	const { playlistId, spotifyAuth } = props;

	const onSubmit: SubmitHandler<FormInput> = (data: FormInput) => {
		const { spotifyURL } = data;
		const tokens = spotifyURL
			.substring(0, spotifyURL.indexOf('?'))
			.split('/');
		const spotifyPlaylistId = tokens[4];
		if (spotifyPlaylistId === undefined) {
			setError('spotifyURL', { type: 'focus' }, { shouldFocus: true });
			return;
		}
		const tokenUrl = `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`;
		axios({
			url: tokenUrl,
			method: 'get',
			headers: {
				Authorization: `Bearer ${spotifyAuth.spotifyAccessToken?.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((res) => {
				const songsFromSpotify = res.data.items;
				dispatch(addSongs({ songs: songsFromSpotify, playlistId }));
				reset({ spotifyURL: '' });
				$('#importPlaylist').modal('hide');
				return true;
			})
			.catch(() => {});
	};

	return (
		<div>
			<div
				className="modal fade"
				id="importPlaylist"
				data-bs-keyboard="false"
				data-bs-backdrop="static"
				tabIndex={-1}
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title text-dark">
								Import Spotify Playlist
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							/>
						</div>
						<form
							className="me-3"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="modal-body text-dark">
								<span className="col-form-label">
									Spotify Playlist URL
								</span>
								<input
									id="url"
									className={`form-control  ${
										errors.spotifyURL && 'is-invalid'
									}`}
									placeholder="https://open.spotify.com/playlist/1VhJ4MMCZFRqFU3zc76zWp"
									aria-label="Song"
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...register('spotifyURL', {
										required: true,
									})}
									onBlur={() => clearErrors()}
								/>
							</div>
							<div className="modal-footer">
								<input
									className="btn btn-primary"
									type="submit"
									id="submitURL"
									value="Import"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImportPlaylist;
