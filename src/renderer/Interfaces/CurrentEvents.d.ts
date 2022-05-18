import EventInterface from './EventInterface';

export default interface CurrentEvents extends EventInterface<boolean> {
	lastUpdate: number;
	updateTime: number;
}
