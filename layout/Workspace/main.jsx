import { useEffect } from "react";
import Console from "../Console/main";
import native from "../../src/resources/native";

export default function Workspace({
	canAccess,
	frontEnd,
	setFrontEnd,
	backEnd,
	setBackEnd,
	children,
}) {
	useEffect(() => {
		app.on("console-log", (data) => {
			frontEnd.console.content[
				Object.keys(frontEnd.console.content).length
			] = {
				...data,
				date: native.timestamp(),
			};
			if (!frontEnd.console.open) frontEnd.console.noview++;
			setFrontEnd({ ...frontEnd });
		});
	}, []);
	return canAccess() == 0 ? (
		<>
			<div className="shadow bg-slate-100 dark:bg-slate-700">
				{/* <div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
					Layout parent 📋
					<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
						layout/main.jsx
					</span>
					<button onClick={logOut}>Log out</button>
				</div> */}

				{!frontEnd.console.open && (
					<main
						className="overflow-x-hidden overflow-y-auto"
						style={{
							height:
								"calc(100vh - " +
								frontEnd.screen.hbartitle * 3 +
								"px)",
						}}
					>
						{children}
					</main>
				)}
			</div>
			{!frontEnd.console.open && (
				<div
					style={{ height: frontEnd.screen.hbartitle }}
					className="flex justify-end items-center pr-6"
				>
					<div className="flex justify-start items-center gap-2">
						<div>
							<span className="font-bold">DB:</span>{" "}
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
				</div>
			)}
			<Console
				safeArea={frontEnd.screen.hbartitle}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
			/>
		</>
	) : null;
}
