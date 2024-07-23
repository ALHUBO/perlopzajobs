import { useEffect, useState } from "react";
import Button from "../../components/Button";
export default function Database({ daemon, setDaemon }) {
	const [editing, setEditing] = useState(false);
	var [backend, setBackEnd] = useState(false);
	var [data, setData] = useState({
		ip: "",
		port: "",
		user: "",
		pass: "",
		db: "",
		driver: "",
	});

	const [oldD, setOldD] = useState({
		ip: "",
		port: "",
		user: "",
		pass: "",
		db: "",
		driver: "",
	});
	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});

	const same = () => {
		return (
			data.ip == oldD.ip &&
			data.port == oldD.port &&
			data.user == oldD.user &&
			data.pass == oldD.pass &&
			data.db == oldD.db &&
			data.driver == oldD.driver
		);
	};

	const db_save = () => {
		if (data.driver == "") {
			setNotif({
				type: 2,
				sms: "Elige un driver para la conexión",
			});
			return;
		}
		setBackEnd((backend = true));
		app.send("db-save", data);
	};

	const db_saved = (datx) => {
		setNotif({
			type: 2,
			sms: "¡Se guardo la nueva configuarcion!",
		});
		setDaemon({
			...daemon,
			data: {
				ip: datx.IP,
				port: datx.port,
				user: datx.user,
				pass: datx.password,
				db: datx.database,
				driver: datx.driver,
			},
		});
		setTimeout(() => {
			setBackEnd((backend = false));
			setNotif({
				...notif,
				sms: "",
			});
			setEditing(false);
		}, 800);
	};
	const establish = () => {
		setNotif({ ...notif, sms: "" });
		if (typeof data.driver != "string" || data.driver == "" || backend)
			return;

		setBackEnd((backend = true));
		if (daemon.db.stablished) app.send("db-disconnect", true);
		else app.send("db-connect", true);
	};

	useEffect(() => {
		setData({
			...daemon.data,
		});

		setOldD({
			...daemon.data,
		});
	}, [daemon]);

	useEffect(() => {
		app.on("db-save", (datx) => {
			db_saved(datx);
		});

		app.on("db-conection", (datx) => {
			setBackEnd((backend = false));
			setDaemon({ ...daemon, db: datx });
		});
		app.on("db-onconection-error", (datx) => {
			setBackEnd((backend = false));
			console.error(datx);
			setNotif({
				type: 2,
				sms: "Ocurrio un error en la conexión a la base de datos",
			});
		});
		app.on("db-conection-error", (datx) => {
			setBackEnd((backend = false));
			console.error(datx);
			setNotif({
				type: 2,
				sms: "Ocurrio un error en al intentar conectar a la base de datos",
			});
		});
		app.on("db-close-error", (datx) => {
			setBackEnd((backend = false));
			console.error(datx);
			setNotif({
				type: 2,
				sms: "Ocurrio al intentar cerrar la conexión",
			});
		});
	}, []);
	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2">
			<div className="text-2xl text-slate-700">Base de datos</div>
			{editing ? (
				<>
					{(data.driver == "mysql" || data.driver == "mariadb") && (
						<>
							<div>
								<input
									type="text"
									placeholder="IP address (localhost)"
									value={data.ip}
									onChange={(e) => {
										setData({
											...data,
											ip: e.target.value,
										});
									}}
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Puerto (3306)"
									value={data.port}
									onChange={(e) => {
										setData({
											...data,
											port: e.target.value,
										});
									}}
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Usuario (root)"
									value={data.user}
									onChange={(e) => {
										setData({
											...data,
											user: e.target.value,
										});
									}}
								/>
							</div>
							<div>
								<input
									type="password"
									placeholder="Password ()"
									value={data.pass}
									onChange={(e) => {
										setData({
											...data,
											pass: e.target.value,
										});
									}}
								/>
							</div>
						</>
					)}
					{data.driver != "" && (
						<div>
							<input
								type="text"
								placeholder="Database (perlopzajobs)"
								value={data.db}
								onChange={(e) => {
									setData({ ...data, db: e.target.value });
								}}
							/>
						</div>
					)}
					<div>
						<select
							value={data.driver}
							onChange={(e) => {
								setData({ ...data, driver: e.target.value });
							}}
						>
							<option value="">Driver</option>
							<option value="mysql">MySQL</option>
							<option value="mariadb">MariaDB</option>
							<option value="sqlite">SQLite</option>
						</select>
					</div>
					<div className="flex justify-end items-center gap-4">
						<Button
							onClick={() => {
								setNotif({
									...notif,
									sms: "",
								});
								setData({ ...oldD });
								setEditing(false);
							}}
							disabled={backend}
						>
							Cancelar
						</Button>
						<Button onClick={db_save} disabled={same() || backend}>
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
								{daemon.db.stablished
									? "Conectado"
									: "Desconectado"}
							</div>
							<div
								className={
									"w-4 h-4  border-2 rounded-full " +
									(daemon.db.stablished
										? "bg-lime-500 border-lime-900"
										: "bg-red-500 border-red-900")
								}
							></div>
						</div>
						<div className="flex justify-end items-center">
							{backend ? (
								<div className="loader"></div>
							) : (
								<Button
									onClick={establish}
									disabled={
										typeof data.driver != "string" ||
										data.driver == ""
									}
								>
									{daemon.db.stablished
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
							disabled={backend || daemon.db.stablished}
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
