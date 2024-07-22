import { useEffect } from "react";
import LinkTo from "../../components/LinkTo";
import LayoutB from "./layout";
export default function Page({ UI, setUI, globalVal, setGlobalVal }) {
	useEffect(() => {
		console.log("use efect");
		UI.Title = "Otra Pagina";
		setUI({ ...UI });
	}, []);
	return (
		<LayoutB>
			<div className="shadow border-[0.2vmin] border-slate-600 dark:border-slate-100 rounded p-[2vmin]  m-[2vmin]">
				<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
					Esta es otra pagina
					<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
						pages/otra/index.jsx
					</span>
				</div>
				<div className="py-[4vmin] grid text-center lg:max-w-5xl lg:w-full lg:mb-0 md:grid-cols-2 lg:grid-cols-4 lg:text-left">
					<button
						className="btn"
						onClick={() => {
							setGlobalVal("Sin contenido");
						}}
					>
						Resetear [globalVal]
					</button>
				</div>
				<div className="py-[4vmin] grid text-center lg:max-w-5xl lg:w-full lg:mb-0 md:grid-cols-2 lg:grid-cols-4 lg:text-left">
					<LinkTo
						href="/"
						licon="&lt;-"
						ricon={null}
						direction={true}
						title="Regresar"
						desc="Regresa a la pagina principal"
					/>
				</div>
			</div>
		</LayoutB>
	);
}
