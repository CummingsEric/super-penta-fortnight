import './App.css';
import { Provider } from 'react-redux';
import Pages from './Components/global/Pages';
import store from './Store/store';
import SpotifyGlobalListener from './Components/spotify/SpotifyGlobalListener';

export default function App() {
	return (
		<Provider store={store}>
			<SpotifyGlobalListener />
			<Pages />
		</Provider>
	);
}
