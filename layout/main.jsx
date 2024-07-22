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
	const [UI, setUI] = useState({
		Lang: "noneLang",
		Mode: "system",
		DarkMode: false,
		Maximize: false,
		FullScreen: false,
		Title: "ALHUBOSoft",
		Screen: { width: 100, height: 100 },
	});

	const [daemon, setDaemon] = useState({
		db: false,
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
		setSession("hola");
		return;
	};

	const logOut = () => {
		setSession("");
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
					"-webkit-app-region": "drag",
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
							"-webkit-app-region": "no-drag",
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
								"-webkit-app-region": "no-drag",
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
							"-webkit-app-region": "no-drag",
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
							"-webkit-app-region": "no-drag",
						}}
						onClick={() => {
							app.send("app-exit", null);
						}}
					>
						<Icon id="close" />
					</button>
				</div>
			</div>
			{session === null && (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-6xl">
						Cargando sesión
						<Icon id="autorenew" />
					</div>
					<div className="loader"></div>
				</div>
			)}

			{typeof session == "string" && session == "" && (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-4xl">
						Iniciar Sesión
						<Icon id="badge" />
					</div>
					<div>
						<input type="text" placeholder="usuario" />
					</div>
					<div>
						<input type="text" placeholder="contraseña" />
					</div>
					<div>
						<button onClick={logIn}>Entrar</button>
					</div>
				</div>
			)}

			{typeof session == "string" && session != "" && (
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
