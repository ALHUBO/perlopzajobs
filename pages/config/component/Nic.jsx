import { useEffect, useState } from "react";
import Button from "../../../components/Button";

export default function Nic({ backEnd, setBackEnd }) {
	let [editing, setEditing] = useState(false);
	let [saving, setSaving] = useState(false);
	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});
	const [list, setList] = useState({});

	let [act, setAct] = useState("");
	let [old, setOld] = useState("");

	useEffect(() => {
		app.on("nic-get", (response) => {
			setList({ ...response });
			setAct(backEnd.server);
			setOld(backEnd.server);
		});
		app.send("nic-get", null);
	}, []);

	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2 w-full">
			<div className="text-2xl text-slate-700">IP servidor</div>
			<div>[{act != "" ? act : "No establecido"}]</div>
			{editing ? (
				<>
					<div>
						<select
							value={act}
							onChange={(e) => {
								setAct((act = e.target.value));
							}}
						>
							<option value="">Tarjeta de red</option>
							{Object.keys(list).map((v, k) => (
								<option key={k} value={list[v]}>
									{v}
								</option>
							))}
						</select>
					</div>
					<div className="flex justify-end items-center gap-4">
						<Button
							onClick={() => {
								setNotif({
									...notif,
									sms: "",
								});
								setAct((act = old));
								setEditing(false);
							}}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => {
								if (act == "") {
									setNotif({
										type: 1,
										ico: "",
										sms: "No puedes dejar sin configuración",
									});
									return;
								}
								setNotif({
									type: 0,
									ico: "",
									sms: "Se guardó correctamente!",
								});
								setTimeout(() => {
									setNotif({
										...notif,
										sms: "",
									});
								}, 2000);
								setOld((old = act));
								backEnd.server = act;
								setBackEnd({ ...backEnd });
								setEditing(false);
							}}
							disabled={old == act || saving}
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
								{backEnd.server != ""
									? "Configurado"
									: "Sin Configurar"}
							</div>
							<div
								className={
									"w-4 h-4  border-2 rounded-full " +
									(backEnd.server != ""
										? "bg-lime-500 border-lime-900"
										: "bg-red-500 border-red-900")
								}
							></div>
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
			{notif.sms != "" && <div>{notif.sms}</div>}
		</div>
	);
}
