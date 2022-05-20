import spotifyLogo from '/assets/images/Spotify_Logo_RGB_White.png';
import background from '../../../videos/background.mp4';

const Home = () => {
	return (
		<div>
			<video autoPlay muted loop className="video-background">
				<source src={background} type="video/mp4" />
			</video>
			<div className="page-container">
				<div className="home-page-main-text-container">
					<p className="home-header">Welcome to Sona</p>
					<p className="home-subtext">Get Playing</p>
				</div>
				<div className="home-page-event-container">
					<p className="home-subtext">Baron Kill | Event </p>
				</div>
			</div>
			<div className="width-100">
				<img className="spotify-logo" alt="" src={spotifyLogo} />
			</div>
		</div>
	);
};

export default Home;
