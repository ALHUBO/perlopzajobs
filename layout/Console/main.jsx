import Icon from "../../components/Icon";
import Log from "./component/log";

export default function Console({ safeArea = 0, frontEnd, setFrontEnd }) {
	return (
		<div
			className=" overflow-hidden z-[1000] w-full bg-slate-50 border-t-2 border-t-slate-300 flex flex-col duration-300 "
			style={{
				height: frontEnd.console.open
					? `calc(100vh - ${safeArea}px)`
					: `${safeArea}px`,
			}}
		>
			<div
				className={
					"px-4 flex justify-between cursor-pointer duration-300  " +
					(frontEnd.console.open
						? "bg-slate-200 text-slate-800 rounded-lg"
						: " bg-white text-slate-400 ")
				}
				onClick={() => {
					frontEnd.console.noview = 0;
					frontEnd.console.open = !frontEnd.console.open;
					setFrontEnd({ ...frontEnd });
				}}
			>
				<div>
					Console{" "}
					{frontEnd.console.noview > 0 &&
						`(${frontEnd.console.noview})`}
				</div>
				<div className="text-5xl flex justify-center items-center">
					<div className="h-0 overflow-visible -translate-y-6">
						<Icon
							id={
								frontEnd.console.open
									? "arrow_drop_up"
									: "arrow_drop_down"
							}
						/>
					</div>
				</div>
			</div>
			{frontEnd.console.open && (
				<>
					{Object.keys(frontEnd.console.content).length > 0 && (
						<div className="py-1 px-4 bg-white shadow-xl shadow-white">
							<button
								className="hover:scale-125 text-2xl border-2 border-slate-300 rounded-xl duration-200 w-8 h-8 flex justify-center items-center"
								onClick={() => {
									frontEnd.console.content = {};
									setFrontEnd({ ...frontEnd });
								}}
							>
								<Icon id="delete" />
							</button>
						</div>
					)}
					<div className="flex-1  overflow-y-auto overflow-x-hidden">
						{Object.keys(frontEnd.console.content).length <= 0 && (
							<div className="text-lg text-slate-400 text-center py-6">
								No hay mensajes de consola.
							</div>
						)}
						{Object.keys(frontEnd.console.content)
							.reverse()
							.map((x) => (
								<Log
									key={x}
									data={frontEnd.console.content[x]}
								/>
							))}
					</div>
				</>
			)}
		</div>
	);
}
