import { CurrSong } from 'renderer/Store/currSong';
import MainState from 'renderer/Interfaces/MainState';
import { useSelector } from 'react-redux';
import spotifyLogo from '/assets/images/Spotify_Logo_RGB_White.png';

const Home = () => {
	const currSong: CurrSong = useSelector(
		(state: MainState) => state.currSong
	);

	return (
		<div>
			<div className="home-page-main-text-container">
				<p className="home-header">Welcome to Sona</p>
				<p className="home-subtext">Get Playing</p>
			</div>
			<div className="home-page-event-container">
				<p className="home-subtext">
					{currSong.songName} | {currSong.songEvent}
				</p>
			</div>
			<img className="spotify-logo" alt="" src={spotifyLogo} />
		</div>
	);
};

export default Home;
