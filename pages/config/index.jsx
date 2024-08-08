import { useEffect } from "react";
import Database from "./component/database";
import Nic from "./component/Nic";
import Udp from "./component/udp";
import Websocket from "./component/websocket";

export default function Config({ frontEnd, setFrontEnd, backEnd, setBackEnd }) {
	useEffect(() => {
		console.log(backEnd);
	}, []);
	return (
		<div>
			<div>Configuracion</div>
			<div className="flex justify-start items-start flex-col px-4 py-2 gap-6">
				<Nic backEnd={backEnd} setBackEnd={setBackEnd} />
				<Udp backEnd={backEnd} setBackEnd={setBackEnd} />
				<Websocket backEnd={backEnd} setBackEnd={setBackEnd} />
				<Database backEnd={backEnd} setBackEnd={setBackEnd} />
			</div>
		</div>
	);
}
