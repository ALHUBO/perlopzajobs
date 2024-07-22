import Database from "./database";

export default function Config({ daemon, setDaemon }) {
	return (
		<div>
			<div>Configuracion</div>
			<div className="flex justify-start items-start flex-wrap px-4 py-2">
				<Database daemon={daemon} setDaemon={setDaemon} />
			</div>
		</div>
	);
}
