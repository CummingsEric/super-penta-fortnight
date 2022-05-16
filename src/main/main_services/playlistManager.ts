const fsSync = require('fs');
const fs = require('fs/promises');

// eslint-disable-next-line import/prefer-default-export
export class PlaylistManager {
	// Filename to read and write to
	fileName: string;

	// Current playlist
	playlist: any;

	constructor(fileName: string) {
		this.fileName = fileName;
		this.playlist = {};
		this.syncRead();
	}

	updatePlaylist = (newPlaylist: any) => {
		this.playlist = newPlaylist;
	};

	removeSong = (event: string, song: string) => {
		delete this.playlist[event][song];
	};

	addSong = (event: string, song: any) => {
		this.playlist[event] = song;
	};

	save = async () => {
		try {
			const data = JSON.stringify(this.playlist, null, 4);
			await fs.writeFile(this.fileName, data);
		} catch (err) {
			console.log(err);
		}
	};

	read = async () => {
		try {
			const rawdata = await fs.readFile(this.fileName);
			this.playlist = JSON.parse(rawdata);
		} catch (err) {
			console.log(err);
		}
	};

	syncRead = () => {
		try {
			const rawdata = fsSync.readFileSync(this.fileName);
			this.playlist = JSON.parse(rawdata);
		} catch (err) {
			console.log(err);
		}
	};
}
