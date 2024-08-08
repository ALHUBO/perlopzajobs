import Console from "@layout/Console/main";
import { useState } from "react";
import Icon from "@components/Icon";

export default function ErrorPegi({
	icon = "code_blocks",
	title = "",
	error = "",
}) {
	//!----------------> SafeArea
	const [safeArea, setSafeArea] = useState(0);
	useEffect(() => {
		app.on("config-safearea-get", (response) => {
			setSafeArea(response);
		});

		app.send("config-safearea-get", null);
	}, []);
	return (
		<>
			<div
				className="flex justify-center items-center flex-col"
				style={{
					height: 0 ? "0px" : "calc(100vh - " + safeArea * 2 + "px)",
				}}
			>
				<div className="text-9xl text-red-700">
					<Icon id={icon} />
				</div>
				<div className="font-bold text-3xl text-slate-700 text-center">
					{title}
				</div>
				<div className="text-lg text-slate-500 px-[20%] text-center">
					{error}
				</div>
				<div>
					<button
						onClick={() => {
							app.send("app-exit", null);
						}}
						className="bg-slate-800 text-slate-50 text-lg mt-6 py-1 px-6 shadow rounded-lg duration-200 hover:scale-110 active:scale-90"
					>
						Close program
					</button>
				</div>
			</div>
			{/* <Console /> */}
		</>
	);
}
