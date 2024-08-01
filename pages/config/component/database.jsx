import { useEffect, useState } from "react";
import Button from "../../../components/Button";

export default function Database({ backEnd, setBackEnd }) {
	let [editing, setEditing] = useState(false);
	let [saving, setSaving] = useState(false);

	const [notif, setNotif] = useState({
		type: 0,
		ico: "",
		sms: "",
	});

	const [data, setData] = useState({
		ip: {
			act: "",
			old: "",
		},
		port: {
			act: "",
			old: "",
		},
		user: {
			act: "",
			old: "",
		},
		pass: {
			act: "",
			old: "",
		},
		db: {
			act: "",
			old: "",
		},
		driver: {
			act: "",
			old: "",
		},
	});

	const same = () => {
		return (
			data.ip.act == data.ip.old &&
			data.port.act == data.port.old &&
			data.user.act == data.user.old &&
			data.pass.act == data.pass.old &&
			data.db.act == data.db.old &&
			data.driver.act == data.driver.old
		);
	};

	const old = () => {
		data.ip.act = data.ip.old;
		data.port.act = data.port.old;
		data.user.act = data.user.old;
		data.pass.act = data.pass.old;
		data.db.act = data.db.old;
		data.driver.act = data.driver.old;
		setData({ ...data });
	};

	const db_save = () => {
		if (data.driver.act == "") {
			setNotif({
				type: 2,
				sms: "Elige un driver para la conexión",
			});
			return;
		}
		setSaving((saving = true));
		app.send("db-save", {
			host: data.ip.act,
			port: data.port.act,
			user: data.user.act,
			password: data.pass.act,
			database: data.db.act,
			driver: data.driver.act,
		});
	};

	const db_saved = (datx) => {
		setNotif({
			type: 2,
			sms: "¡Se guardo la nueva configuarcion!",
		});
		backEnd.db.data = {
			ip: datx.host,
			port: datx.port,
			user: datx.user,
			pass: datx.password,
			db: datx.database,
			driver: datx.driver,
		};
		setBackEnd({
			...backEnd,
		});
		setTimeout(() => {
			setSaving((saving = false));
			setNotif({
				...notif,
				sms: "",
			});
			setEditing((editing = false));
		}, 800);
	};
	const establish = () => {
		setNotif({ ...notif, sms: "" });
		if (
			typeof data.driver.act != "string" ||
			data.driver.act == "" ||
			saving
		)
			return;

		setSaving((saving = true));
		if (backEnd.db.stablished) app.send("db-disconnect", true);
		else app.send("db-connect", true);
	};

	useEffect(() => {
		if (backEnd.db.data.driver == "") return;
		setData({
			ip: {
				act: backEnd.db.data.ip,
				old: backEnd.db.data.ip,
			},
			port: {
				act: backEnd.db.data.port,
				old: backEnd.db.data.port,
			},
			user: {
				act: backEnd.db.data.user,
				old: backEnd.db.data.user,
			},
			pass: {
				act: backEnd.db.data.pass,
				old: backEnd.db.data.pass,
			},
			db: {
				act: backEnd.db.data.db,
				old: backEnd.db.data.db,
			},
			driver: {
				act: backEnd.db.data.driver,
				old: backEnd.db.data.driver,
			},
		});
	}, [backEnd]);

	useEffect(() => {
		app.on("db-save", (datx) => {
			db_saved(datx);
			app.send("log-info", {
				icon: "database",
				title: "Data Base",
				content:
					"Se guardó la nueva configuración de la base de datos.",
				advanced: JSON.stringify(datx, null, 2),
			});
		});

		app.on("db-conection", (datx) => {
			setSaving((saving = false));
			setBackEnd({ ...backEnd, db: { ...backEnd.db, stablished: datx } });
			if (datx)
				app.send("log-success", {
					icon: "database",
					title: "Data Base",
					content: "Se estableció la conexión con la base de datos.",
				});
			else
				app.send("log-warning", {
					icon: "database",
					title: "Data Base",
					content:
						"Se cerró la conexión con la base de datos correctamente.",
				});
		});
		app.on("db-onconection-error", (datx) => {
			setSaving((saving = false));
			setNotif({
				type: 2,
				sms: "Ocurrio un error.",
			});
			app.send("log-error", {
				icon: "database",
				title: "Data Base",
				content: "Ocurrio un error en la conexión a la base de datos.",
				advanced: datx,
			});
		});
		app.on("db-conection-error", (datx) => {
			setSaving((saving = false));
			setNotif({
				type: 2,
				sms: "Ocurrio un error.",
			});
			app.send("log-error", {
				icon: "database",
				title: "Data Base",
				content:
					"Ocurrio un error en al intentar conectar a la base de datos.",
				advanced: datx,
			});
		});
		app.on("db-close-error", (datx) => {
			setSaving((saving = false));
			setNotif({
				type: 2,
				sms: "Ocurrio un error.",
			});
			app.send("log-error", {
				icon: "database",
				title: "Data Base",
				content: "Ocurrio al intentar cerrar la conexión.",
				advanced: datx,
			});
		});
	}, []);
	return (
		<div className=" border-2 border-slate-500 rounded-lg px-4 py-2">
			<div className="text-2xl text-slate-700">Base de datos</div>
			{editing ? (
				<>
					{(data.driver.act == "mysql" ||
						data.driver.act == "mariadb") && (
						<>
							<div>
								<input
									type="text"
									placeholder="IP address (localhost)"
									value={
										data.ip.act == "localhost"
											? ""
											: data.ip.act
									}
									onChange={(e) => {
										setData({
											...data,
											ip: {
												...data.ip,
												act: e.target.value,
											},
										});
									}}
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Puerto (3306)"
									value={
										data.port.act == "3306"
											? ""
											: data.port.act
									}
									onChange={(e) => {
										setData({
											...data,
											port: {
												...data.port,
												act: e.target.value,
											},
										});
									}}
								/>
							</div>
							<div>
								<input
									type="text"
									placeholder="Usuario (root)"
									value={
										data.user.act == "root"
											? ""
											: data.user.act
									}
									onChange={(e) => {
										setData({
											...data,
											user: {
												...data.user,
												act: e.target.value,
											},
										});
									}}
								/>
							</div>
							<div>
								<input
									type="password"
									placeholder="Password ()"
									value={data.pass.act}
									onChange={(e) => {
										setData({
											...data,
											pass: {
												...data.pass,
												act: e.target.value,
											},
										});
									}}
								/>
							</div>
						</>
					)}
					{data.driver.act != "" && (
						<div>
							<input
								type="text"
								placeholder="Database (perlopzajobs)"
								value={
									data.db.act == "perlopzajobs"
										? ""
										: data.db.act
								}
								onChange={(e) => {
									setData({
										...data,
										db: { ...data.db, act: e.target.value },
									});
								}}
							/>
						</div>
					)}
					<div>
						<select
							value={data.driver.act}
							onChange={(e) => {
								setData({
									...data,
									driver: {
										...data.driver,
										act: e.target.value,
									},
								});
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
								old();
								setEditing(false);
							}}
							disabled={saving}
						>
							Cancelar
						</Button>
						<Button onClick={db_save} disabled={same() || saving}>
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
								{backEnd.db.stablished
									? "Conectado"
									: "Desconectado"}
							</div>
							<div
								className={
									"w-4 h-4  border-2 rounded-full " +
									(backEnd.db.stablished
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
									onClick={establish}
									disabled={
										typeof data.driver.act != "string" ||
										data.driver.act == ""
									}
								>
									{backEnd.db.stablished
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

			{notif.sms != "" && <div>{notif.sms}</div>}
		</div>
	);
}
