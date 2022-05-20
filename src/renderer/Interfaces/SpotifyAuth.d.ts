import SpotifyAccessToken from './SpotifyAccessToken';
import SpotifyAccessCode from './SpotifyAccessCode';

export default interface SpotifyAuth {
	spotifyAccessCode?: SpotifyAccessCode;
	spotifyAccessToken?: SpotifyAccessToken;
	spotifyRefreshToken?: string;
}
