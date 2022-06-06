import { CurrSong } from 'renderer/Store/currSong';
import MainState from 'renderer/Interfaces/MainState';
import { useSelector } from 'react-redux';
import spotifyLogo from '../../assets/Spotify_Logo_RGB_White.png';

const Home = () => {
	const currSong: CurrSong = useSelector(
		(state: MainState) => state.currSong
	);

	const displayEvent = currSong.songEvent !== undefined;

	return (
		<div>
			<div className="home-page-main-text-container">
				<p className="home-header">Welcome to Sona</p>
				<p className="home-subtext">Get Playing</p>
			</div>
			<div className="home-page-event-container">
				<p className="home-subtext">
					{displayEvent && (
						<span>
							{currSong.songName} | {currSong.songEvent}
						</span>
					)}
				</p>
			</div>
			<img className="spotify-logo" alt="SpotifyLogo" src={spotifyLogo} />
		</div>
	);
};

export default Home;
