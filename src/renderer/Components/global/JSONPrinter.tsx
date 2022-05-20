interface JSONProps {
	data: object;
}

const JSONPrinter = (props: JSONProps) => {
	const { data } = props;
	return (
		<div className="console">
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</div>
	);
};

export default JSONPrinter;
