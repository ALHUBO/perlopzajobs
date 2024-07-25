import { useEffect, useState } from "react";
import Icon from "../components/Icon";

export default function Access({ ctrl, setCtrl, UI, setUI }) {
	const [notf, setNotf] = useState({
		type: 0,
		sms: "",
		ico: "",
	});
	const logIn = () => {
		setNotf({
			type: 0,
			sms: "",
			ico: "key",
		});
		if (ctrl.wait) return;
		if (typeof ctrl.pass != "string" || ctrl.pass == "") return;
		if (!ctrl.codex) {
			setCtrl((ctrl = { ...ctrl, wait: true }));
			app.send("access-create", ctrl.pass);
		} else {
			setCtrl((ctrl = { ...ctrl, wait: true }));
			app.send("access-enter", ctrl.pass);
		}
		return;
	};

	useEffect(() => {
		app.on("access-exists", (data) => {
			if (data) setUI((UI = { ...UI, Title: "Ingresa contraseña" }));
			else setUI((UI = { ...UI, Title: "Crear una contraseña" }));
			setCtrl((ctrl = { ...ctrl, codex: data }));
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
				setCtrl(
					(ctrl = {
						...ctrl,
						wait: false,
					})
				);
			} else {
				setNotf({
					type: 0,
					sms: "Se ha creado la nueva contraseña correctamente.",
					ico: "key",
				});
				setTimeout(() => {
					setNotf({
						type: 0,
						sms: "",
						ico: "key",
					});
					setUI((UI = { ...UI, Title: "Ingresa contraseña" }));
					setCtrl(
						(ctrl = {
							...ctrl,
							pass: data ? "" : ctrl.pass,
							codex: true,
							wait: false,
						})
					);
				}, 2000);
			}
		});
		app.on("access-enter", (data) => {
			console.log(data);
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

				setCtrl(
					(ctrl = {
						...ctrl,
						access: false,
						wait: false,
					})
				);
				console.log(ctrl);
			} else {
				setNotf({
					type: 0,
					sms: "¡Bienvenido!",
					ico: "key",
				});
				setTimeout(() => {
					setNotf({
						type: 0,
						sms: "",
						ico: "key",
					});
					setCtrl(
						(ctrl = {
							...ctrl,
							access: "asdasd",
							wait: false,
						})
					);
				}, 1000);
			}
		});

		app.send("access-exists", null);
	}, []);
	return (
		<>
			{ctrl.codex === null && (
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
			{typeof ctrl.codex == "boolean" && !ctrl.codex && (
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
							type="password"
							placeholder="Contraseña"
							disabled={ctrl.wait}
							value={ctrl.pass}
							onChange={(e) => {
								setCtrl(
									(ctrl = { ...ctrl, pass: e.target.value })
								);
							}}
						/>
					</div>
					{notf.sms != "" && <div>{notf.sms}</div>}
					<div>
						<button onClick={logIn} disabled={ctrl.wait}>
							Crear
						</button>
					</div>
				</div>
			)}
			{typeof ctrl.codex == "boolean" &&
				ctrl.codex &&
				typeof ctrl.access != "string" && (
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
								type="password"
								placeholder="contraseña"
								disabled={ctrl.wait}
								value={ctrl.pass}
								onChange={(e) => {
									setCtrl(
										(ctrl = {
											...ctrl,
											pass: e.target.value,
										})
									);
								}}
							/>
						</div>
						{notf.sms != "" && <div>{notf.sms}</div>}
						<div>
							<button onClick={logIn} disabled={ctrl.wait}>
								Entrar
							</button>
						</div>
					</div>
				)}
		</>
	);
}
