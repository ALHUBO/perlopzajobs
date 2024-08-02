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
		if (typeof backEnd.access.pass != "string" || backEnd.access.pass == "")
			return false;

		backEnd.access.wait = true;
		setBackEnd({ ...backEnd });
		if (!backEnd.access.exists)
			app.send("access-create", backEnd.access.pass);
		else app.send("access-enter", backEnd.access.pass);

		return true;
	};

	useEffect(() => {
		app.on("access-exists", (data) => {
			if (data) frontEnd.title = "Ingresa contraseña";
			else frontEnd.title = "Crear una contraseña";
			backEnd.access.exists = data;
			setFrontEnd({ ...frontEnd });
			setBackEnd({ ...backEnd });
		});
		app.on("access-create", (data) => {
			let error = "";
			if (data.error == 1)
				error = "La contraseña no cumple los requisitos.";
			else if (data.error == 2)
				error = "No fue posible guardar la contraseña.";
			else if (data.error == 3)
				error = "No fue posible encriptar la contraseña.";

			if (error != "") {
				setNotf({
					type: 2,
					sms: error,
					ico: "key",
				});
				backEnd.access.wait = false;
				setBackEnd({ ...backEnd });
			} else {
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
					if (data.error == 0) backEnd.access.pass = "";
					setBackEnd({ ...backEnd });
				}, 2000);
			}
		});
		app.on("access-enter", (data) => {
			let error = "";
			if (data.error == 1)
				error = "No se ingresó una contraseña correctamente.";
			else if (data.error == 2) error = "La contraseña es incorrecta.";
			else if (data.error == 3)
				error = "No fue posible leer la contraseña.";
			else if (data.error == 4)
				error = "No fue posible desencriptar la contraseña.";

			if (error != "") {
				setNotf({
					type: 2,
					sms: error,
					ico: "key",
				});

				backEnd.access.wait = false;
				backEnd.access.can = false;
				setBackEnd({ ...backEnd });
			} else {
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
			}
		});

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
