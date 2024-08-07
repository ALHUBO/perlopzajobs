import { useEffect } from "react";
import Icon from "../../components/Icon";
import Link from "next/link";

export default function Bartitle({
	height = 0,
	frontEnd,
	setFrontEnd,
	canAccess,
	backEnd,
	setBackEnd,
}) {
	const logOut = () => {
		backEnd.title = "Ingresar Contraseña";
		backEnd.access.can = false;
		app.send("log-info", {
			icon: "logout",
			title: "Log out",
			content: "The session has been closed by the user.",
		});
		setBackEnd({ ...backEnd });
	};
	useEffect(() => {
		if (frontEnd.theme.dark) document.body.classList.add("dark");
		else document.body.classList.remove("dark");
	}, [frontEnd]);

	useEffect(() => {
		app.on("app-screen-size", (data) => {
			frontEnd.screen.width = data.width;
			frontEnd.screen.height = data.height;
			frontEnd.screen.hbartitle = frontEnd.screen.height * 0.04;
			setFrontEnd(frontEnd);
		});
		app.on("app-screen-maximize", (data) => {
			frontEnd.screen.maximize = data;
			setFrontEnd({ ...frontEnd });
		});
		app.on("app-screen-full", (data) => {
			frontEnd.screen.full = data;
			setFrontEnd({ ...frontEnd });
		});
		app.on("nativetheme-update", (data) => {
			frontEnd.theme.mode = data.type;
			frontEnd.theme.dark = data.dark;
			setFrontEnd({ ...frontEnd });
		});

		app.send("app-screen-size", null);
	}, []);
	return (
		<div
			className={
				"relative z-[1000] w-[100vw] bg-slate-700 grid text-slate-100"
			}
			style={{
				height: height + "px",
				WebkitAppRegion: "drag",
				gridTemplateColumns: "2fr 3fr 1fr",
			}}
		>
			<div
				className="flex justify-start items-center overflow-ellipsis pl-2 gap-2"
				style={{
					WebkitAppRegion: "no-drag",
					fontSize: `${frontEnd.screen.hbartitle * 0.5}px`,
				}}
			>
				{canAccess() == 0 && (
					<>
						<div className="group">
							<Link
								href="/"
								className="flex justify-center items-center gap-1 duration-200 hover:bg-white/25 cursor-pointer px-1 rounded-lg"
							>
								<Icon id="home" /> Inicio
							</Link>
							<div className="text-slate-700 h-0 w-0 overflow-visible hidden group-hover:block">
								<div
									className="bg-slate-700 w-32"
									style={{
										height: `${
											frontEnd.screen.hbartitle * 0.05
										}px`,
									}}
								></div>
								<div
									className="bg-slate-100 w-32 h-32 border-slate-700 border-2 rounded-b-lg overflow-hidden"
									style={{
										height: `${frontEnd.screen.hbartitle}px`,
									}}
								>
									<button
										className="flex justify-start items-center hover:bg-slate-700 w-full hover:text-white px-2 gap-1"
										onClick={logOut}
										style={{
											height: `${frontEnd.screen.hbartitle}px`,
										}}
									>
										<Icon id="logout" />
										Cerrar Sesión
									</button>
								</div>
							</div>
						</div>
						<Link
							href="/config"
							className="flex justify-center items-center gap-1 duration-200 hover:bg-white/25 cursor-pointer px-1 rounded-lg"
						>
							<Icon id="settings" /> Ajustes
						</Link>
					</>
				)}
			</div>
			<div className="flex items-center justify-center">
				<div
					className="flex items-center justify-center border-[0.2vmin] w-[100%] rounded overflow-hidden text-ellipsis"
					style={{
						height: height * 0.7 + "px",
						fontSize: height * 0.5 + "px",
					}}
				>
					{frontEnd.title}
				</div>
			</div>
			<div className="flex justify-end items-center ">
				<button
					className="cursor-pointer hover:bg-[#ffffff57] flex items-center justify-center duration-300"
					style={{
						width: height * 1.4 + "px",
						height: height + "px",
						fontSize: height + "px",
						WebkitAppRegion: "no-drag",
					}}
					onClick={() => {
						app.send("app-minimize", null);
					}}
				>
					<Icon id="minimize" />
				</button>
				{!frontEnd.screen.full ? (
					<button
						className="cursor-pointer hover:bg-[#ffffff57] flex items-center justify-center duration-300"
						style={{
							width: height * 1.4 + "px",
							height: height + "px",
							WebkitAppRegion: "no-drag",
						}}
						onClick={() => {
							app.send("app-maximize", !frontEnd.screen.maximize);
						}}
					>
						{frontEnd.screen.maximize ? (
							<Icon
								id="select_window_2"
								style={{
									fontSize: height * 0.8 + "px",
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
						width: height * 1.4 + "px",
						height: height + "px",
						fontSize: height + "px",
						WebkitAppRegion: "no-drag",
					}}
					onClick={() => {
						app.send("app-fullscreen", !frontEnd.screen.full);
					}}
				>
					{frontEnd.screen.full ? (
						<Icon id="fullscreen_exit" />
					) : (
						<Icon id="fullscreen" />
					)}
				</button>
				<button
					className="cursor-pointer hover:bg-[#e50000] flex items-center justify-center duration-300"
					style={{
						width: height * 1.4 + "px",
						height: height + "px",
						fontSize: height + "px",
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
	);
}
