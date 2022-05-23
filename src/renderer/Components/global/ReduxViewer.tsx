import { useSelector } from 'react-redux';
import MainState from 'renderer/Interfaces/MainState';
import JSONPrinter from './JSONPrinter';

const ReduxViewer = () => {
	// Searched songs
	const reduxState = useSelector((state: MainState) => state);

	return (
		<div>
			<h1 className="text-center">Redux Viewer</h1>
			<JSONPrinter data={reduxState} />
		</div>
	);
};

export default ReduxViewer;
