import { useState } from 'react';
import { useSelector } from 'react-redux';

const LeagueDataDisplay = () => {
	const [money, setMoney] = useState(8008);

	const token = useSelector((state: any) => state.spotifyToken.value);

	const getData = () => {
		console.log('making data request');
		window.electron.ipcRenderer.sendMessage('get-league-data', ['request']);
		setTimeout(getData, 5000);
	};

	window.electron.ipcRenderer.once('get-league-data', (arg: any) => {
		// eslint-disable-next-line no-console
		console.log(arg);
		if (arg != null) {
			setMoney(arg.activePlayer.currentGold);
		}
	});

	return (
		<div>
			<button type="button" onClick={getData}>
				Display Gold
			</button>
			<h1>{money}</h1>
			<span>{token}</span>
		</div>
	);
};

export default LeagueDataDisplay;
