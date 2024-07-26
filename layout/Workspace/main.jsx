import Console from "../Console/main";

export default function Workspace({
	canAccess,
	frontEnd,
	setFrontEnd,
	backEnd,
	setBackEnd,
	children,
}) {
	const logOut = () => {
		backEnd.title = "Ingresar Contraseña";
		backEnd.access.can = false;
		setBackEnd({ ...backEnd });
	};
	return canAccess() == 0 ? (
		<>
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
					{children}
				</main>
			</div>
			<Console
				safeArea={frontEnd.screen.hbartitle}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
			/>
		</>
	) : null;
}
