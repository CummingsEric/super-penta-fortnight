import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import Settings from 'renderer/Interfaces/Settings';
import SpotifyDevice from 'renderer/Interfaces/SpotifyDevice';
import { setSettings } from 'renderer/Store/settings';

const SelectDevice = () => {
	const [devices, setDevices] = useState<SpotifyDevice[]>([]);
	const dispatch = useDispatch();

	const spotifyAuth = useSelector((state: MainState) => state.spotifyAuth);
	const settings = useSelector((state: MainState) => state.settings.value);
	const { spotifyAccessToken } = spotifyAuth;

	const getDevices = () => {
		if (spotifyAccessToken === null || spotifyAccessToken === undefined)
			return [];
		const tokenUrl = 'https://api.spotify.com/v1/me/player/devices';
		axios({
			url: tokenUrl,
			method: 'get',
			headers: {
				Authorization: `Bearer ${spotifyAccessToken.authToken}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((resp) => {
				const inDevices = resp.data.devices as SpotifyDevice[];
				if (inDevices.length !== devices.length) {
					setDevices(resp.data.devices);
				}
				return null;
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log(err);
			});
		return null;
	};
	getDevices();

	const selectDevice = (device: SpotifyDevice) => {
		const newSettings: Settings = { spotifyDevice: device };
		window.electron.ipcRenderer.sendMessage('save-settings', [newSettings]);
		dispatch(setSettings(newSettings));
	};

	const deviceJSX = devices.map((device) => {
		return (
			<li
				onClick={() => selectDevice(device)}
				aria-hidden="true"
				key={device.id}
			>
				<span className="dropdown-item">
					{device.name} - {device.type}
				</span>
			</li>
		);
	});

	const selectorText =
		devices.length === 0 ? 'No online devices' : 'Select Spotify Device';

	return (
		<div>
			<h1 className="text-center"> Settings</h1>
			<div className="py-2 border-bottom">
				<h3>Set Spotify Device</h3>
				<h5>
					Selected Device:{' '}
					<span>
						{settings &&
						settings.spotifyDevice &&
						settings.spotifyDevice.name
							? `${settings.spotifyDevice.name}-${settings.spotifyDevice.type}`
							: 'No device selected'}
					</span>
				</h5>
				<div className="dropdown">
					<button
						className="btn btn-secondary dropdown-toggle"
						type="button"
						id="selectDevice"
						data-bs-toggle={devices.length !== 0 ? 'dropdown' : ''}
						aria-expanded="false"
					>
						{selectorText}
					</button>
					<ul
						className="dropdown-menu"
						aria-labelledby="selectDevice"
					>
						{deviceJSX}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default SelectDevice;
