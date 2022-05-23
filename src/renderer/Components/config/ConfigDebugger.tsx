import { useState } from 'react';
import ConfigFile from 'renderer/Interfaces/ConfigFile';
import './Console.css';
import JSONPrinter from '../global/JSONPrinter';

const ConfigDebugger = () => {
	const [config, setConfig] = useState<ConfigFile>();

	const loadConfig = () => {
		window.electron.ipcRenderer.once('load-config', (arg) => {
			const newConfig = arg as ConfigFile;
			if (newConfig !== null) {
				setConfig(newConfig);
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
	};

	const resetConfig = () => {
		window.electron.ipcRenderer.sendMessage('reset-config', ['request']);
		loadConfig();
	};

	if (config === undefined) {
		loadConfig();
		return (
			<div>
				<h1 className="text-center">Config Debugger</h1>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-center pb-2">Config Debugger</h1>
			<div className="container">
				<JSONPrinter data={config} />
				<div className="py-2">
					<button
						type="button"
						className="btn btn-primary mx-3"
						onClick={() => loadConfig()}
					>
						Reload
					</button>
					<button
						type="button"
						className="btn btn-danger mx-3"
						onClick={() => resetConfig()}
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfigDebugger;
