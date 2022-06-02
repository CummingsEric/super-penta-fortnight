import EventInterface from './EventInterface';

export interface EventProps {
	friendlyName: string;
	priority: number;
	playlistId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface EventData extends EventInterface<EventProps> {}
