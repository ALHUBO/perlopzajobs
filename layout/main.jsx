// Layout.js
import {
	useState,
	useEffect,
	Fragment,
	cloneElement,
	Children,
	isValidElement,
} from "react";
import Icon from "../components/Icon";

export default function Layout({ children }) {
	let [UI, setUI] = useState({
		Lang: "noneLang",
		Mode: "system",
		DarkMode: false,
		Maximize: false,
		FullScreen: false,
		Title: "ALHUBOSoft",
		Screen: { width: 100, height: 100 },
	});

	const [daemon, setDaemon] = useState({
		db: {
			stablished: false,
			data: { ip: "", port: "", user: "", pass: "", db: "", driver: "" },
		},
	});

	let [ctrl, setCtrl] = useState({
		codex: null,
		pass: "",
		access: false,
		wait: false,
	});

	const [langs, setLangs] = useState({});

	const [session, setSession] = useState(null);

	let childs = Children.toArray(children).filter((child) =>
		isValidElement(child)
	);

	let hbartitle = UI.Screen.height * 0.04;

	function toggleUIMode() {
		let ch = "system";
		if (UI.Mode == "system") {
			ch = "light";
			UI.DarkMode = false;
		} else if (UI.Mode == "light") {
			ch = "dark";
			UI.DarkMode = true;
		}
		UI.Mode = ch;
		setUI({ ...UI });
		app.send("nativetheme-get", ch);
	}

	function __(txt) {
		if (typeof txt != "string") return "It's not possible to translate";
		if (UI.Lang == "en") return txt;
		if (typeof langs.en == "undefined") return txt;
		let n = langs.en[txt];
		if (
			typeof n != "undefined" &&
			typeof langs[UI.Lang] != "undefined" &&
			typeof langs[UI.Lang][n] != "undefined"
		) {
			return langs[UI.Lang][n];
		} else return txt;
	}

	const logIn = () => {
		if (ctrl.wait) return;
		if (typeof ctrl.pass != "string" || ctrl.pass == "") return;
		if (!ctrl.codex) {
			setCtrl((ctrl = { ...ctrl, wait: true }));
			app.send("access-create", ctrl.pass);
		} else {
			setCtrl((ctrl = { ...ctrl, wait: true }));
			console.log("antes");
			console.log(ctrl);
			app.send("access-enter", ctrl.pass);
		}
		return;
	};

	const logOut = () => {
		setUI((UI = { ...UI, Title: "Ingresa contraseña" }));
		setCtrl((ctrl = { ...ctrl, access: false }));
	};

	const loadDataConection = () => {
		let dbc = localStorage.getItem("config.db");
	};

	useEffect(() => {
		// app.send("app-fullscreen", UI.Fullscreen);
		if (UI.DarkMode) document.body.classList.add("dark");
		else document.body.classList.remove("dark");
	}, [UI]);
	//!---------------------------[ Despues de cargar el DOM ]------------------------------
	useEffect(() => {
		app.on("app-screen-size", (data) => {
			UI.Screen = { ...data };
			hbartitle = UI.Screen.height * 0.04;
			setUI({ ...UI });
		});

		app.send("app-screen-size", null);

		app.on("access-exists", (data) => {
			console.error("exists");
			if (data) setUI((UI = { ...UI, Title: "Ingresa contraseña" }));
			else setUI((UI = { ...UI, Title: "Crear una contraseña" }));
			setCtrl((ctrl = { ...ctrl, codex: data }));
		});
		app.send("access-exists", null);

		app.on("access-create", (data) => {
			console.error("create");
			setUI((UI = { ...UI, Title: "Ingresa contraseña" }));
			let pass = ctrl.pass;
			if (data) {
				pass = "";
			}
			setCtrl((ctrl = { ...ctrl, pass, codex: data, wait: false }));
		});

		app.on("access-enter", (data) => {
			console.log("despues");
			console.log(ctrl);
			setCtrl(
				(ctrl = { ...ctrl, pass: ctrl.pass, access: data, wait: false })
			);
		});

		let tk = localStorage.getItem("session.tk");
		if (typeof tk != "string") setSession("");
		else setSession(tk);
	}, []);

	return (
		<Fragment>
			<div
				className={
					"w-[100vw] bg-slate-700 z-[1000] grid text-slate-100"
				}
				style={{
					height: hbartitle + "px",
					WebkitAppRegion: "drag",
					gridTemplateColumns: "2fr 3fr 1fr",
				}}
			>
				<div></div>
				<div className="flex items-center justify-center">
					<div
						className="flex items-center justify-center border-[0.2vmin] w-[100%] rounded overflow-hidden text-ellipsis"
						style={{
							height: hbartitle * 0.7 + "px",
							fontSize: hbartitle * 0.5 + "px",
						}}
					>
						{UI.Title}
					</div>
				</div>
				<div className="flex justify-end items-center ">
					<button
						className="cursor-pointer hover:bg-[#ffffff57] flex items-center justify-center duration-300"
						style={{
							width: hbartitle * 1.4 + "px",
							height: hbartitle + "px",
							fontSize: hbartitle + "px",
							WebkitAppRegion: "no-drag",
						}}
						onClick={() => {
							app.send("app-minimize", null);
						}}
					>
						<Icon id="minimize" />
					</button>
					{!UI.FullScreen ? (
						<button
							className="cursor-pointer hover:bg-[#ffffff57] flex items-center justify-center duration-300"
							style={{
								width: hbartitle * 1.4 + "px",
								height: hbartitle + "px",
								WebkitAppRegion: "no-drag",
							}}
							onClick={() => {
								app.send("app-maximize", !UI.Maximize);
							}}
						>
							{UI.Maximize ? (
								<Icon
									id="select_window_2"
									style={{
										fontSize: hbartitle * 0.8 + "px",
									}}
								/>
							) : (
								<Icon id="crop_square" />
							)}
						</button>
					) : null}
					<button
						className="cursor-pointer hover:bg-[#0084c3] flex items-center justify-center duration-300"
						style={{
							width: hbartitle * 1.4 + "px",
							height: hbartitle + "px",
							fontSize: hbartitle + "px",
							WebkitAppRegion: "no-drag",
						}}
						onClick={() => {
							app.send("app-fullscreen", !UI.FullScreen);
						}}
					>
						{UI.FullScreen ? (
							<Icon id="fullscreen_exit" />
						) : (
							<Icon id="fullscreen" />
						)}
					</button>
					<button
						className="cursor-pointer hover:bg-[#e50000] flex items-center justify-center duration-300"
						style={{
							width: hbartitle * 1.4 + "px",
							height: hbartitle + "px",
							fontSize: hbartitle + "px",
							WebkitAppRegion: "no-drag",
						}}
						onClick={() => {
							app.send("app-exit", null);
						}}
					>
						<Icon id="close" />
					</button>
				</div>
			</div>
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
						<div>
							<button onClick={logIn} disabled={ctrl.wait}>
								Entrar
							</button>
						</div>
					</div>
				)}

			{typeof ctrl.codex == "boolean" &&
				ctrl.codex &&
				typeof ctrl.access == "string" && (
					<div className="shadow bg-slate-100 dark:bg-slate-700 min-h-[100vh]">
						<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
							Layout parent 📋
							<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
								layout/main.jsx
							</span>
							<button onClick={logOut}>Log out</button>
						</div>

						<main
							className="overflow-x-hidden overflow-y-auto"
							style={{ height: "calc(100vh - 12.8vmin)" }}
						>
							{childs.map((child, index) =>
								cloneElement(child, {
									key: index,
									daemon,
									setDaemon,
									UI,
									setUI,
									__,
									toggleUIMode,
								})
							)}
						</main>
					</div>
				)}
		</Fragment>
	);
}
