/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import Playlist from 'renderer/Interfaces/Playlist';
import MainState from 'renderer/Interfaces/MainState';
import EventInterface from 'renderer/Interfaces/EventInterface';
import { setMapping } from 'renderer/Store/eventMapping';

// TODO: validate this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IFormInput = any;

const EventManager = () => {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		const newMap = Object.fromEntries(
			Object.entries(data).filter(([key]) => !key.endsWith('num'))
		);
		const newPrios = Object.fromEntries(
			Object.entries(data)
				.filter(([key]) => key.endsWith('num'))
				.map(([key, entry]) => [key.replace('num', ''), entry])
		);
		window.electron.ipcRenderer.sendMessage('save-events', [newMap]);
		dispatch(setMapping(newMap));
	};

	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const events: EventInterface<string> = useSelector(
		(state: MainState) => state.eventPlaylistMappings.value
	);

	if (events === undefined) {
		window.electron.ipcRenderer.once('load-config', (arg: any) => {
			// TODO: validate
			if (arg !== null) {
				dispatch(setMapping(arg.eventPlaylistMappings));
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
		return <></>;
	}

	const eventDisplay = Object.keys(events).map((e) => {
		return (
			<div key={e} className="input-group mb-3">
				<span className="input-group-text">{e}</span>
				<select
					defaultValue={events[e as keyof EventInterface<string>]}
					{...register(e)}
					className="form-select"
				>
					{libraryData.map((a) => {
						return (
							<option key={e + a.id} value={a.id}>
								{a.name}
							</option>
						);
					})}
				</select>
				<input
					type="number"
					className="form-control"
					{...register(`${e}num`)}
				/>
			</div>
		);
	});

	return (
		<div>
			<h1>Events</h1>
			<div className="container">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="overflow-auto" style={{ height: '70vh' }}>
						{eventDisplay}
					</div>
					<input type="submit" />
				</form>
			</div>
		</div>
	);
};

export default EventManager;
