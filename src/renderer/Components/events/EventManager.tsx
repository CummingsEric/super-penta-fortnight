/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import Playlist from 'renderer/Interfaces/Playlist';
import MainState from 'renderer/Interfaces/MainState';
import EventData, { EventProps } from 'renderer/Interfaces/EventData';
import { setAllEvents } from 'renderer/Store/eventData';

const EventManager = () => {
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onSubmit: SubmitHandler<any> = (data: EventData) => {
		window.electron.ipcRenderer.sendMessage('save-events', [data]);
		dispatch(setAllEvents(data));
	};

	const libraryData: Playlist[] = useSelector(
		(state: MainState) => state.library.value
	);

	const events: EventData = useSelector(
		(state: MainState) => state.eventData.value
	);

	if (events === null || events === undefined) return <></>;

	const sortedEvents = Object.entries(events).sort(
		(
			[, entryA]: [string, EventProps],
			[, entryB]: [string, EventProps]
		) => {
			if (entryA.priority < entryB.priority) return 1;
			if (entryB.priority < entryA.priority) return -1;
			if (entryA.friendlyName < entryB.friendlyName) return 1;
			if (entryB.friendlyName < entryA.friendlyName) return -1;
			return 0;
		}
	);

	const eventDisplay = sortedEvents.map(
		([key, event]: [string, EventProps]) => {
			const defaultPlaylist =
				event.playlistId === undefined ? '' : event.playlistId;
			return (
				<div key={key} className="input-group mb-3">
					<span className="input-group-text event-input-1">
						{event.friendlyName}
					</span>
					<select
						defaultValue={defaultPlaylist}
						{...register(`${key}.playlistId`)}
						className="form-select event-input-2"
					>
						<option value="" disabled>
							Select one
						</option>
						{libraryData.map((song) => {
							return (
								<option key={key + song.id} value={song.id}>
									{song.name}
								</option>
							);
						})}
					</select>
					<input
						type="number"
						className="event-input-3 form-control flex-grow-0"
						defaultValue={event.priority}
						{...register(`${key}.priority`, {
							min: 0,
							max: 99,
							valueAsNumber: true,
						})}
					/>
					<input
						type="hidden"
						{...register(`${key}.friendlyName`)}
						value={event.friendlyName}
					/>
				</div>
			);
		}
	);

	return (
		<div className="page-container">
			<h1 className="text-center pb-2">Events</h1>
			<div className="container">
				<div className="input-group row">
					<div className="event-header-1">Event</div>
					<div className="event-header-2">Playlist</div>
					<div className="event-header-3">Priority</div>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="scrollbar-gradient events-container mb-3">
						<div className="force-overflow">{eventDisplay}</div>
					</div>
					<input type="submit" className="btn btn-primary" />
				</form>
			</div>
		</div>
	);
};

export default EventManager;
