import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import native from "../../../src/resources/native";

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

	useEffect(() => {
		app.on("nic-get", (response) => {
			setList({ ...response });
			if (
				typeof backEnd.ip == "string" &&
				backEnd.ip != "" &&
				Object.values(response).includes(backEnd.ip)
			) {
				setAct(backEnd.ip);
			}
		});
		app.send("nic-get", null);

		app.on("config-ip-save", (response) => {
			if (response) {
				setEditing(false);
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
				}, 1500);
			} else
				setNotif({
					type: 2,
					ico: "router",
					sms: "Ocurrio un error al intentar guardar",
				});
		});
	}, []);

	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2 w-full">
			<div className="text-2xl text-slate-700 flex justify-start items-center gap-1">
				<Icon id="router" />
				IP servidor
				<div className="group">
					<div className="text-base flex justify-center items-center cursor-pointer">
						<Icon id="help" />
					</div>
					<div className="h-0 w-0 overflow-visible hidden group-hover:block">
						<div className="relative z-50 bg-white border-2 border-slate-800 w-min text-justify px-4 py-2 rounded-lg shadow text-sm">
							Elige una IP estatica para que el servidor funcione
							correctamente.
						</div>
					</div>
				</div>
			</div>
			<div>[ {act != "" ? act : "No establecido"} ]</div>
			{editing ? (
				<>
					<div>
						<select
							value={act}
							onChange={(e) => {
								setAct(e.target.value);
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
								setAct((act = backEnd.ip));
								setEditing((editing = false));
							}}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button
							onClick={() => {
								// if (!native.isIP(act)) {
								// 	setNotif({
								// 		type: 1,
								// 		ico: "",
								// 		sms: "No se selecciono una IP valida.",
								// 	});
								// 	return;
								// }
								console.log(act);
								backEnd.ip = act;
								app.send("config-ip-save", {
									config: { ...backEnd },
									shifer: localStorage.getItem(
										"config.shifer"
									),
								});
							}}
							disabled={
								backEnd.ip == act ||
								saving ||
								backEnd.udp.stablished ||
								backEnd.ws.stablished ||
								backEnd.db.stablished
							}
						>
							Guardar
						</Button>
					</div>
				</>
			) : (
				<>
					<div>
						<div className="flex justify-start items-center gap-2">
							<div className="flex justify-center items-center gap-1">
								<Icon id="dynamic_form" />
								<span className="font-bold">Status:</span>
								{typeof backEnd.ip == "string" &&
								backEnd.ip != ""
									? "Configurado"
									: "Sin Configurar"}
							</div>
							<div
								className={
									"w-4 h-4  border-2 rounded-full " +
									(typeof backEnd.ip == "string" &&
									backEnd.ip != ""
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
							disabled={
								saving ||
								backEnd.udp.stablished ||
								backEnd.ws.stablished ||
								backEnd.db.stablished
							}
							className="flex justify-center items-center gap-1 "
						>
							<Icon id="rule_settings" />
							Configurar
						</Button>
					</div>
				</>
			)}
			{notif.sms != "" && <div>{notif.sms}</div>}
		</div>
	);
}
