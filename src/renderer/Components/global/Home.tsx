import { CurrSong } from 'renderer/Store/currSong';
import MainState from 'renderer/Interfaces/MainState';
import { useSelector } from 'react-redux';
import spotifyLogo from '/assets/images/Spotify_Logo_RGB_White.png';
import background from '../../../videos/background.mp4';

const Home = () => {
	const currSong: CurrSong = useSelector(
		(state: MainState) => state.currSong
	);

	return (
		<div>
			<div className="page-container">
				<div className="home-page-main-text-container">
					<p className="home-header">Welcome to Sona</p>
					<p className="home-subtext">Get Playing</p>
				</div>
				<div className="home-page-event-container">
					<p className="home-subtext">
						{currSong.songName} | {currSong.songEvent}
					</p>
				</div>
			</div>
			<div className="width-100">
				<img className="spotify-logo" alt="" src={spotifyLogo} />
			</div>
		</div>
	);
};

export default Home;
