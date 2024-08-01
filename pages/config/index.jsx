import Database from "./component/database";

export default function Config({ frontEnd, setFrontEnd, backEnd, setBackEnd }) {
	return (
		<div>
			<div>Configuracion</div>
			<div className="flex justify-start items-start flex-wrap px-4 py-2">
				<Database backEnd={backEnd} setBackEnd={setBackEnd} />
			</div>
		</div>
	);
}
