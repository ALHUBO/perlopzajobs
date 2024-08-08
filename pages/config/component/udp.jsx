import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import native from "../../../src/resources/native";

export default function Udp({ backEnd, setBackEnd }) {
	let [editing, setEditing] = useState(false);
	let [saving, setSaving] = useState(false);
	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});

	const [port, setPort] = useState({
		E: "",
		S: "",
	});
	const saveAs = () => {
		if (!native.isPort(port.E)) port.E = 56789;
		if (!native.isPort(port.S)) port.S = 56790;

		if (parseInt(port.E) == parseInt(port.S)) {
			setNotif({
				type: 2,
				ico: "",
				sms: "No puedes ser iguales los puertos!",
			});
			return;
		}

		if (
			parseInt(port.S) == parseInt(backEnd.udp.data.port.S) &&
			parseInt(port.E) == parseInt(backEnd.udp.data.port.E)
		) {
			setNotif({
				type: 1,
				ico: "",
				sms: "Ya esta guardada la configuración",
			});
			return;
		}

		if (
			parseInt(port.E) == parseInt(backEnd.ws.data.port) ||
			parseInt(port.S) == parseInt(backEnd.ws.data.port)
		) {
			setNotif({
				type: 2,
				ico: "",
				sms: "No puedes utilizar el puerto del Websocket!",
			});
			return;
		}
		if (!native.isIP(backEnd.ip)) {
			setNotif({
				type: 2,
				ico: "",
				sms: "Aún no se ha configurado la IP del servidor!",
			});
			return;
		}

		setSaving((saving = true));
		backEnd.udp.data.port.E = port.E;
		backEnd.udp.data.port.S = port.S;
		app.send("config-udp-save", {
			config: { ...backEnd },
			shifer: localStorage.getItem("config.shifer"),
		});
	};

	const saved = (response) => {
		if (response) {
			setSaving((saving = false));
			setEditing((editing = false));
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
		} else
			setNotif({
				type: 2,
				ico: "",
				sms: "Ocurrio un error!",
			});
	};

	useEffect(() => {
		app.on("config-udp-save", (response) => saved(response));
		setPort({
			E: backEnd.udp.data.port.E,
			S: backEnd.udp.data.port.S,
		});
	}, []);
	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2 w-full">
			<div className="text-2xl text-slate-700 flex justify-start items-center gap-1">
				<Icon id="dns" />
				Server UDP
				<div className="group">
					<div className="text-base flex justify-center items-center cursor-pointer">
						<Icon id="help" />
					</div>
					<div className="h-0 w-0 overflow-visible hidden group-hover:block">
						<div className="relative z-50 bg-white border-2 border-slate-800 w-min text-justify px-4 py-2 rounded-lg shadow text-sm">
							Elige puertos dinamicos de preferencia.
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-start items-center gap-4">
				<div className="flex justify-start items-center gap-1">
					{"[ "}
					<div className="font-bold flex justify-center items-center gap-1">
						<Icon id="hearing" />
						Escuchar:
					</div>
					<div>{!isNaN(parseInt(port.E)) ? port.E : "56789"}</div>
					{" ]"}
				</div>
				<div className="flex justify-start items-center gap-1">
					{"[ "}
					<div className="font-bold flex justify-center items-center gap-1">
						<Icon id="send" />
						Enviar:
					</div>
					<div>{!isNaN(parseInt(port.S)) ? port.S : "56789"}</div>
					{" ]"}
				</div>
			</div>
			{editing ? (
				<>
					<div className="font-bold text-lg flex justify-start items-center gap-1">
						<Icon id="hearing" />
						Escuchar:
					</div>
					{!isNaN(parseInt(port.E)) && (
						<div>
							{parseInt(port.E) >= 0 && parseInt(port.E) < 1024
								? "Este es un puerto bien conocido. Es muy posible que este en uso"
								: parseInt(port.E) >= 1024 &&
								  parseInt(port.E) < 49151
								? "Este es un puerto registrado. Es probable que este ocupado."
								: "Este es un puerto dinámico o privado. Es muy problable que este libre."}
						</div>
					)}
					<div>
						<input
							type="text"
							placeholder="Puerto escucha (56789)"
							value={port.E == "56789" ? "" : port.E}
							onChange={(e) => {
								port.E = e.target.value;
								port.E = parseInt(port.E);

								if (isNaN(parseInt(port.E))) port.E = "";
								if (port.E < 0) port.E = 0;
								if (port.E > 65535) port.E = 65535;
								setPort({ ...port });
							}}
						/>
					</div>
					<div className="font-bold text-lg">
						<Icon id="send" />
						Enviar:
					</div>
					{!isNaN(parseInt(port.S)) && (
						<div>
							{parseInt(port.S) >= 0 && parseInt(port.S) < 1024
								? "Este es un puerto bien conocido. Es muy posible que este en uso"
								: parseInt(port.S) >= 1024 &&
								  parseInt(port.S) < 49151
								? "Este es un puerto registrado. Es probable que este ocupado."
								: "Este es un puerto dinámico o privado. Es muy problable que este libre."}
						</div>
					)}
					<div>
						<input
							type="text"
							placeholder="Puerto escucha (56790)"
							value={port.S == "56790" ? "" : port.S}
							onChange={(e) => {
								port.S = e.target.value;
								port.S = parseInt(port.S);

								if (isNaN(parseInt(port.S))) port.S = "";
								if (port.S < 0) port.S = 0;
								if (port.S > 65535) port.S = 65535;
								setPort({ ...port });
							}}
						/>
					</div>
					<div className="flex justify-end items-center gap-4">
						<Button
							onClick={() => {
								setNotif({
									...notif,
									sms: "",
								});
								port.E = backEnd.udp.data.port.E;
								port.S = backEnd.udp.data.port.S;
								setPort({ ...port });
								setEditing(false);
							}}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button
							onClick={saveAs}
							disabled={
								!native.isPort(port.E) ||
								!native.isPort(port.S) ||
								parseInt(port.S) == parseInt(port.E) ||
								parseInt(port.S) ==
									parseInt(backEnd.ws.data.port) ||
								parseInt(port.E) ==
									parseInt(backEnd.ws.data.port) ||
								(parseInt(port.S) ==
									parseInt(backEnd.udp.data.port.S) &&
									parseInt(port.E) ==
										parseInt(backEnd.udp.data.port.E)) ||
								saving
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
									onClick={() => {
										app.send("udp-start", null);
									}}
									disabled={
										backEnd.ip == "" ||
										saving ||
										!native.isPort(
											backEnd.udp.data.port.E
										) ||
										!native.isPort(
											backEnd.udp.data.port.S
										) ||
										backEnd.udp.data.port.S ==
											backEnd.udp.data.port.E
									}
									className="flex justify-center items-center gap-1"
								>
									<Icon
										id={
											backEnd.udp.stablished
												? "cloud_download"
												: "cloud_upload"
										}
									/>
									{backEnd.udp.stablished
										? "Desactivar"
										: "Activar"}
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
							disabled={
								backEnd.ip == "" ||
								saving ||
								backEnd.udp.stablished
							}
							className="flex justify-center items-center gap-1"
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
