import { useEffect, useState } from "react";
import Button from "../../../components/Button";

export default function Udp({ backEnd, setBackEnd }) {
	let [editing, setEditing] = useState(false);
	let [saving, setSaving] = useState(false);
	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});

	const [port, setPort] = useState({
		E: { old: "", act: "" },
		S: {
			old: "",
			act: "",
		},
	});
	const restablish = () => {
		port.E.act = backEnd.udp.portE;
		port.E.old = backEnd.udp.portE;
		port.S.act = backEnd.udp.portS;
		port.S.old = backEnd.udp.portS;
		setPort({ ...port });
	};
	const saveAs = () => {
		if (isNaN(parseInt(port.E.act))) port.E.act = 56789;

		if (isNaN(parseInt(port.S.act))) port.S.act = 56790;
		if (parseInt(port.E.act) == parseInt(port.S.act)) {
			setNotif({
				type: 2,
				ico: "",
				sms: "No puedes ser iguales los puertos!",
			});
			return;
		}

		if (
			parseInt(port.E.act) == parseInt(backEnd.ws.port) ||
			parseInt(port.S.act) == parseInt(backEnd.ws.port)
		) {
			setNotif({
				type: 2,
				ico: "",
				sms: "No puedes utilizar el puerto del Websocket!",
			});
			return;
		}
		const expReg =
			/^((25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])\.){3}(25[0-5]{1}|2[0-4][0-9]|1[0-9]{2}|[0-9]?[0-9])$/;
		if (!expReg.test(backEnd.server)) {
			setNotif({
				type: 2,
				ico: "",
				sms: "Aún no se ha configurado la IP del servidor!",
			});
			return;
		}

		setSaving((saving = true));
		console.log("send");
		app.send("udp-save", {
			ip: backEnd.server,
			portE: port.E.act,
			portS: port.S.act,
		});
	};

	const saved = (response) => {
		restablish();
		backEnd.udp.portE = parseInt(response.portE);
		backEnd.udp.portS = parseInt(response.portS);
		setBackEnd({ ...backEnd });
		restablish();
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
	};

	useEffect(() => {
		restablish();
		app.on("udp-save", (response) => {
			console.log("response");
			saved(response);
		});
	}, []);
	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2 w-full">
			<div className="text-2xl text-slate-700">Server UDP</div>
			<div>
				[
				{`Escuchar: ${
					!isNaN(parseInt(port.E.act)) ? port.E.act : "56789"
				} Enviar: ${
					!isNaN(parseInt(port.S.act)) ? port.S.act : "56790"
				}`}
				]
			</div>
			{editing ? (
				<>
					<div className="font-bold text-lg">Escuchar:</div>
					{!isNaN(parseInt(port.E.act)) && (
						<div>
							{parseInt(port.E.act) >= 0 &&
							parseInt(port.E.act) < 1024
								? "Este es un puerto bien conocido. Es muy posible que este en uso"
								: parseInt(port.E.act) >= 1024 &&
								  parseInt(port.E.act) < 49151
								? "Este es un puerto registrado. Es probable que este ocupado."
								: "Este es un puerto dinámicos o privados. Es muy problable que este libre."}
						</div>
					)}
					<div>
						<input
							type="text"
							placeholder="Puerto escucha (56789)"
							value={port.E.act == "56789" ? "" : port.E.act}
							onChange={(e) => {
								port.E.act = e.target.value;
								port.E.act = parseInt(port.E.act);

								if (isNaN(parseInt(port.E.act)))
									port.E.act = "";
								if (port.E.act < 0) port.E.act = 0;
								if (port.E.act > 65535) port.E.act = 65535;
								setPort({ ...port });
							}}
						/>
					</div>
					<div className="font-bold text-lg">Enviar:</div>
					{!isNaN(parseInt(port.S.act)) && (
						<div>
							{parseInt(port.S.act) >= 0 &&
							parseInt(port.S.act) < 1024
								? "Este es un puerto bien conocido. Es muy posible que este en uso"
								: parseInt(port.S.act) >= 1024 &&
								  parseInt(port.S.act) < 49151
								? "Este es un puerto registrado. Es probable que este ocupado."
								: "Este es un puerto dinámicos o privados. Es muy problable que este libre."}
						</div>
					)}
					<div>
						<input
							type="text"
							placeholder="Puerto escucha (56790)"
							value={port.S.act == "56790" ? "" : port.S.act}
							onChange={(e) => {
								port.S.act = e.target.value;
								port.S.act = parseInt(port.S.act);

								if (isNaN(parseInt(port.S.act)))
									port.S.act = "";
								if (port.S.act < 0) port.S.act = 0;
								if (port.S.act > 65535) port.S.act = 65535;
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
								port.E.act = port.E.old;
								port.S.act = port.S.old;
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
								(parseInt(port.E.act) == parseInt(port.E.old) &&
									parseInt(port.S.act) ==
										parseInt(port.S.old)) ||
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
									onClick={() => {
										app.send("udp-start", null);
									}}
									disabled={backEnd.server == "" || saving}
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
							disabled={
								backEnd.server == "" ||
								saving ||
								backEnd.udp.stablished
							}
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
