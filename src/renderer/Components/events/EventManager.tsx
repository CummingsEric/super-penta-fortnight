/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import Playlist from 'renderer/Interfaces/Playlist';
import MainState from 'renderer/Interfaces/MainState';
import EventInterface from 'renderer/Interfaces/EventInterface';
import { setMapping } from 'renderer/Store/eventMapping';
import { setPriority } from 'renderer/Store/eventPriority';
import { setLibrary } from 'renderer/Store/playlistData';

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
				.map(([key, entry]) => [
					key.replace('num', ''),
					// eslint-disable-next-line radix
					// TODO: fix this
					Number.isNaN(parseInt(entry)) ? 0 : parseInt(entry),
				])
		);
		window.electron.ipcRenderer.sendMessage('save-events', [
			newMap,
			newPrios,
		]);
		dispatch(setMapping(newMap));
		dispatch(setPriority(newPrios));
	};

	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const events: EventInterface<string> = useSelector(
		(state: MainState) => state.eventPlaylistMappings.value
	);

	const priorities: EventInterface<number> = useSelector(
		(state: MainState) => state.priorities.value
	);

	if (events === undefined) {
		window.electron.ipcRenderer.once('load-config', (arg: any) => {
			// TODO: validate
			if (arg !== null) {
				dispatch(setLibrary(arg.library));
				dispatch(setMapping(arg.eventPlaylistMappings));
				dispatch(setPriority(arg.priorities));
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
		return <></>;
	}

	const sortedEvents = Object.entries(priorities).sort(
		([keyA, entryA], [keyB, entryB]) => {
			if (entryA < entryB) return 1;
			if (entryB < entryA) return -1;
			return 0;
		}
	);

	const eventDisplay = sortedEvents.map(([e]) => {
		const parsed =
			priorities !== undefined
				? priorities[e as keyof EventInterface<number>]
				: 0;
		const priority = Number.isNaN(parsed) ? 0 : parsed;
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
					defaultValue={priority}
					{...register(`${e}num`, { min: 0, max: 99 })}
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
