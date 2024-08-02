import { useState } from "react";
import Button from "../../../components/Button";

export default function Websocket({ backEnd, setBackEnd }) {
	let [editing, setEditing] = useState(false);
	let [saving, setSaving] = useState(false);
	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});

	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2 w-full">
			<div className="text-2xl text-slate-700">Server WebSocket</div>
			{editing ? (
				<>
					<div>
						<input
							type="text"
							placeholder="Puerto comunicación (3000)"
							value={""}
							onChange={(e) => {}}
						/>
					</div>
					<div className="flex justify-end items-center gap-4">
						<Button
							onClick={() => {
								setNotif({
									...notif,
									sms: "",
								});
								// old();
								setEditing(false);
							}}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => {}}
							disabled={/* same() ||  */ saving}
						>
							Guardar
						</Button>
					</div>
				</>
			) : (
				<>
					<div>
						<div className="flex justify-start items-center gap-2">
							<div>
								<span className="font-bold">Status:</span>{" "}
								{backEnd.udp.stablished
									? "Conectado"
									: "Desconectado"}
							</div>
							<div
								className={
									"w-4 h-4  border-2 rounded-full " +
									(backEnd.udp.stablished
										? "bg-lime-500 border-lime-900"
										: "bg-red-500 border-red-900")
								}
							></div>
						</div>
						<div className="flex justify-end items-center">
							{saving ? (
								<div className="loader"></div>
							) : (
								<Button
									onClick={() => {}}
									disabled={backEnd.server == ""}
								>
									{backEnd.udp.stablished
										? "Desconectar"
										: "Conectar"}
								</Button>
							)}
						</div>
					</div>
					<div>
						<Button
							onClick={() => {
								setNotif({
									...notif,
									sms: "",
								});
								setEditing(true);
							}}
							disabled={saving || backEnd.db.stablished}
						>
							Configurar
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
