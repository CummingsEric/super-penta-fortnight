import './App.css';
import { Provider } from 'react-redux';
import Pages from './Components/global/Pages';
import store from './Store/store';

export default function App() {
	return (
		<Provider store={store}>
			<Pages />
		</Provider>
	);
}
