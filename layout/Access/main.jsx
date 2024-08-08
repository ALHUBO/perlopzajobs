import { useEffect, useState } from "react";
import Icon from "@components/Icon";
import ErrorPegi from "../ErrorPegi/main";

export default function Access({}) {
	//!----------------> Cargar Estado Access
	const [Caccess, setCaccess] = useState(null);
	useEffect(() => {
		app.on("access-load", (response) => {
			if (response.exists) setTitle("Ingresa la contraseña");
			else setTitle("Crear una contraseña");
			setCaccess({ ...response });
		});
		app.on("access-save", (response) => {
			if (response.ok) setCaccess({ ...response.data });
		});
		app.send("access-load", null);
	}, []);

	//!----------------> Notificaciones
	const [notf, setNotf] = useState({
		type: 0,
		sms: "",
		ico: "",
	});
	const notif = ({ sms = "", type = 0, ico = "help" }) => {
		if (typeof sms != "string") sms = "";
		if (isNaN(parseInt(type)) || parseInt(type) < 0 || parseInt(type) > 3)
			type = 0;
		if (typeof ico != "string") ico = "help";
		setNotf({ sms, type, ico });
	};

	//!----------------> Utilidades externas
	const setTitle = (title) => {
		app.send("conf-title-set", title);
	};

	//!----------------> SafeArea
	const [safeArea, setSafeArea] = useState(0);
	useEffect(() => {
		app.on("config-safearea-get", (response) => {
			setSafeArea(response);
		});

		app.send("config-safearea-get", null);
	}, []);
	//!----------------> Utilidades internas
	let [wait, setWait] = useState(false);
	let [pass, setPass] = useState("");
	let [showPass, setShowPass] = useState(false);

	const _logIn = () => {
		notif({});
		if (Caccess.wait) return false;
		if (typeof Caccess.pass != "string" || Caccess.pass == "") {
			notif({
				type: 1,
				sms: "Ingresa una contraseña",
				ico: "key",
			});
			return false;
		}
		Caccess.wait = true;
		setCaccess({ ...Caccess });
		if (!Caccess.exists) app.send("access-create", Caccess.pass);
		else app.send("access-enter", Caccess.pass);

		return true;
	};

	const _exists = (ex) => {
		if (ex) setTitle("Ingresa contraseña");
		setTitle("Crear una contraseña");
		Caccess.exists = ex;
		setCaccess({ ...backEnd });
	};

	const _create = (response) => {
		if (response) {
			notif({
				type: 0,
				sms: "Se ha creado la nueva contraseña correctamente.",
				ico: "key",
			});
			setTimeout(() => {
				notif({});
				setTitle("Ingresa contraseña");
				Caccess.wait = false;
				Caccess.pass = "";
				Caccess.exists = true;
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

				console.log(backEnd);
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
		app.on("access-create", (data) => _create(data));
		app.on("access-enter", (data) => _enter(data));

		app.send("access-exists", null);
	}, []);
	if (Caccess?.exists && Caccess.can) return <></>;
	return (
		<>
			{Caccess === null ? (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{
						height: 0 ? "0px" : "calc(100vh - " + safeArea + "px)",
					}}
				>
					<div className="flex justify-center items-center gap-1 text-3xl">
						Buscando clave de acceso
						<Icon id="autorenew" />
					</div>
					<div className="loader"></div>
				</div>
			) : Caccess.error ? (
				<ErrorPegi
					ico="key"
					title="Error en clave de acceso"
					error={Caccess.error}
				/>
			) : (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-4xl">
						{Caccess.exists
							? "Desbloquear sistema"
							: "Crear Contraseña"}
						<Icon id="badge" />
					</div>
					<div>
						<input
							type={showPass ? "text" : "password"}
							placeholder="Contraseña"
							disabled={wait}
							value={pass}
							onChange={(e) => {
								setPass(e.target.value);
							}}
							onKeyUp={(e) => {
								if (e.code == "Enter") _logIn();
							}}
						/>
						<button
							onClick={() => {
								setShowPass(!showPass);
							}}
						>
							<Icon
								id={showPass ? "visibility" : "visibility_off"}
							/>
						</button>
					</div>
					{notf.sms != "" && <div>{notf.sms}</div>}
					<div>
						<button onClick={_logIn} disabled={wait}>
							Crear
						</button>
					</div>
				</div>
			)}
		</>
	);
}
