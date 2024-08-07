import { useEffect, useState } from "react";
import Icon from "../../components/Icon";

export default function Access({
	canAccess,
	frontEnd,
	setFrontEnd,
	backEnd,
	setBackEnd,
}) {
	let [showPass, setShowPass] = useState(false);
	const [notf, setNotf] = useState({
		type: 0,
		sms: "",
		ico: "",
	});
	const logIn = () => {
		notf.sms = "";
		setNotf({
			...notf,
		});
		if (backEnd.access.wait) return false;
		if (
			typeof backEnd.access.pass != "string" ||
			backEnd.access.pass == ""
		) {
			setNotf({
				type: 1,
				sms: "Ingresa una contraseña",
				ico: "key",
			});
			return false;
		}

		backEnd.access.wait = true;
		setBackEnd({ ...backEnd });
		if (!backEnd.access.exists)
			app.send("access-create", backEnd.access.pass);
		else app.send("access-enter", backEnd.access.pass);

		return true;
	};

	const _exists = (ex) => {
		if (ex) frontEnd.title = "Ingresa contraseña";
		else frontEnd.title = "Crear una contraseña";
		backEnd.access.exists = ex;
		setFrontEnd({ ...frontEnd });
		setBackEnd({ ...backEnd });
	};

	const _create = (response) => {
		if (response) {
			setNotf({
				type: 0,
				sms: "Se ha creado la nueva contraseña correctamente.",
				ico: "key",
			});
			setTimeout(() => {
				notf.sms = "";
				setNotf({
					...notf,
				});
				frontEnd.title = "Ingresa contraseña";
				setFrontEnd({ ...frontEnd });
				backEnd.access.wait = false;
				backEnd.access.pass = "";
				backEnd.access.exists = true;
				setBackEnd({ ...backEnd });
				app.send("config-save", {
					config: backEnd,
					shifer: localStorage.getItem("config.shifer"),
				});
			}, 2000);
		} else {
			setNotf({
				type: 2,
				sms: "No fue posible crear la contraseña",
				ico: "key",
			});
			backEnd.access.wait = false;
			setBackEnd({ ...backEnd });
		}
	};

	const _enter = (response) => {
		if (response) {
			setNotf({
				type: 0,
				sms: "¡Bienvenido!",
				ico: "key",
			});
			setTimeout(() => {
				notf.sms = "";
				setNotf({
					...notf,
				});

				backEnd.access.can = "asdasd";
				backEnd.access.wait = false;
				backEnd.access.pass = "";
				setBackEnd({ ...backEnd });
			}, 1000);
		} else {
			setNotf({
				type: 2,
				sms: "No es la contraseña correcta",
				ico: "key",
			});
			backEnd.access.wait = false;
			setBackEnd({ ...backEnd });
		}
	};

	useEffect(() => {
		app.on("access-exists", (data) => _exists(data));
		app.on("access-create", (data) => _create(data));
		app.on("access-enter", (data) => _enter(data));

		app.send("access-exists", null);
	}, []);
	return (
		<>
			{canAccess() == 3 && (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-3xl">
						Buscando archivo de configuración
						<Icon id="autorenew" />
					</div>
					<div className="loader"></div>
				</div>
			)}
			{canAccess() == 2 && (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-4xl">
						Crear Contraseña
						<Icon id="badge" />
					</div>
					<div>
						<input
							type={showPass ? "text" : "password"}
							placeholder="Contraseña"
							disabled={backEnd.access.wait}
							value={backEnd.access.pass}
							onChange={(e) => {
								backEnd.access.pass = e.target.value;
								setBackEnd({ ...backEnd });
							}}
							onKeyUp={(e) => {
								if (e.code == "Enter") logIn();
							}}
						/>
						<button
							onClick={() => {
								setShowPass((showPass = !showPass));
							}}
						>
							<Icon
								id={showPass ? "visibility" : "visibility_off"}
							/>
						</button>
					</div>
					{notf.sms != "" && <div>{notf.sms}</div>}
					<div>
						<button onClick={logIn} disabled={backEnd.access.wait}>
							Crear
						</button>
					</div>
				</div>
			)}
			{canAccess() == 1 && (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-4xl">
						Desbloquear sistema
						<Icon id="badge" />
					</div>
					<div>
						<input
							type={showPass ? "text" : "password"}
							placeholder="contraseña"
							disabled={backEnd.access.wait}
							value={backEnd.access.pass}
							onChange={(e) => {
								backEnd.access.pass = e.target.value;
								setBackEnd({ ...backEnd });
							}}
							onKeyUp={(e) => {
								if (e.code == "Enter") logIn();
							}}
						/>
						<button
							onClick={() => {
								setShowPass((showPass = !showPass));
							}}
						>
							<Icon
								id={showPass ? "visibility" : "visibility_off"}
							/>
						</button>
					</div>
					{notf.sms != "" && <div>{notf.sms}</div>}
					<div>
						<button onClick={logIn} disabled={backEnd.access.wait}>
							Entrar
						</button>
					</div>
				</div>
			)}
		</>
	);
}
