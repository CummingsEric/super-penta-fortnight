/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import Playlist from 'renderer/Interfaces/Playlist';
import MainState from 'renderer/Interfaces/MainState';
import EventInterface from 'renderer/Interfaces/EventInterface';
import { setMapping } from 'renderer/Store/eventMapping';
import { setPriority } from 'renderer/Store/eventPriority';

// TODO: validate this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventInput = any;

const EventManager = () => {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();

	const onSubmit: SubmitHandler<EventInput> = (data) => {
		const newMap = Object.fromEntries(
			Object.entries(data).filter(([key]) => !key.endsWith('num'))
		);
		const newPrios = Object.fromEntries(
			Object.entries(data)
				.filter(([key]) => key.endsWith('num'))
				.map(([key, entry]) => [
					key.replace('num', ''),
					Number.isNaN(parseInt(entry as string, 10))
						? 0
						: parseInt(entry as string, 10),
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

	const sortedEvents = Object.entries(priorities).sort(
		([, entryA]: [string, number], [, entryB]: [string, number]) => {
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
				<span className="input-group-text event-input-1">{e}</span>
				<select
					defaultValue={events[e as keyof EventInterface<string>]}
					{...register(e)}
					className="form-select event-input-2"
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
					className="event-input-3 form-control flex-grow-0"
					defaultValue={priority}
					{...register(`${e}num`, { min: 0, max: 99 })}
				/>
			</div>
		);
	});

	return (
		<div className="page-container">
			<h1 className="text-center pb-2">Events</h1>
			<div className="container">
				<div className="input-group row">
					<div className="event-header-1">Event</div>
					<div className="event-header-2">Playlist</div>
					<div className="event-header-3">Priority</div>
				</div>
				<div className="scrollbar-gradient events-container">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="force-overflow">{eventDisplay}</div>
					</form>
				</div>
				<input type="submit" />
			</div>
		</div>
	);
};

export default EventManager;
