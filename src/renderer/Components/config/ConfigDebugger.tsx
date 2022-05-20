import { useState } from 'react';
import ConfigFile from 'renderer/Interfaces/ConfigFile';

// TODO: prop validation
const PrettyPrintJson = (props: any) => {
	const { data } = props;
	return (
		<div>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

const ConfigDebugger = () => {
	const [config, setConfig] = useState<ConfigFile>();

	if (config === undefined) {
		window.electron.ipcRenderer.once('load-config', (arg: any) => {
			// TODO: validate
			if (arg !== null) {
				setConfig(arg);
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
		return (
			<div>
				<h1>Config Debugger</h1>
				<span>Nothing to show yet...</span>
			</div>
		);
	}

	const loadConfig = () => {
		window.electron.ipcRenderer.once('load-config', (arg: any) => {
			// TODO: validate
			if (arg !== null) {
				setConfig(arg);
			}
		});
		window.electron.ipcRenderer.sendMessage('load-config', ['request']);
	};

	const resetConfig = () => {
		window.electron.ipcRenderer.sendMessage('reset-config', ['request']);
		loadConfig();
	};

	// TODO: make this look more like a console
	return (
		<div>
			<h1>Config Debugger</h1>
			<div className="container pt-4">
				<div
					className="container overflow-auto rounded"
					// TODO: make this a class
					style={{
						height: '70vh',
						backgroundColor: '#f6f8fa',
						color: 'black',
					}}
				>
					<PrettyPrintJson data={config} />
				</div>
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
