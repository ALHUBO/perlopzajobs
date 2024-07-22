import { useEffect } from "react";
import LinkTo from "../../components/LinkTo";
import Layout from "./layout";

export default function Page({ UI, setUI, __, toggleUIMode }) {
	useEffect(() => {
		UI.Title = "Pagina Plantilla";
		setUI({ ...UI });
	}, []);
	return (
		<Layout>
			<div className="shadow border-[0.2vmin] border-slate-600 rounded p-[2vmin]  m-[2vmin]">
				<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
					Pagina Plantilla 🧾
					<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
						pages/plantilla/index.jsx
					</span>
				</div>
				<div>
					<div className="text-slate-600 font-bold">Argumentos:</div>
					<div className="text-slate-800">
						Todas las paginas reciben estos argumentos del layout
						<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
							(layout/main.jsx)
						</span>
					</div>

					<div>
						<ul>
							<li>
								<details>
									<summary>
										UI
										<span className="text-cyan-500">
											:object
										</span>{" "}
									</summary>
									<span className="text-slate-500">
										Propiedades de la Interfaz de Usuario
									</span>
								</details>
							</li>
							<ul>
								<li>
									Lang
									<span className="text-cyan-500">
										:string
									</span>{" "}
									<span className="text-slate-500">
										Idioma de la UI (default en)
									</span>
								</li>
								<li>
									Mode
									<span className="text-cyan-500">
										:string
									</span>{" "}
									<span className="text-slate-500">
										Tipo del mode de la UI (default system)
										[system, light, dark]
									</span>
								</li>
								<li>
									DarkMode
									<span className="text-cyan-500">
										:boolean
									</span>{" "}
									<span className="text-slate-500">
										Esta en modo oscuro (Default false)
									</span>
								</li>
								<li>
									Maximize
									<span className="text-cyan-500">
										:boolean
									</span>{" "}
									<span className="text-slate-500">
										Esta la ventana maximizada (Default
										false)
									</span>
								</li>
								<li>
									FullScreen
									<span className="text-cyan-500">
										:boolean
									</span>{" "}
									<span className="text-slate-500">
										Esta la ventana fullscreen (Default
										false)
									</span>
								</li>
								<li>
									Title
									<span className="text-cyan-500">
										:string
									</span>{" "}
									<span className="text-slate-500">
										Titulo de la ventana (Default
										ALHUBOSoft)
									</span>
								</li>
								<li>
									Screen
									<span className="text-cyan-500">
										:object
									</span>{" "}
									<span className="text-slate-500">
										Datos de la pantalla del dispositivo
									</span>
								</li>
								<ul>
									<li>
										width
										<span className="text-cyan-500">
											:number
										</span>{" "}
										<span className="text-slate-500">
											Ancho de la pantalla (Default 100)
										</span>
									</li>
									<li>
										height
										<span className="text-cyan-500">
											:number
										</span>{" "}
										<span className="text-slate-500">
											Alto de la pantalla (Default 100)
										</span>
									</li>
								</ul>
							</ul>
							<li>
								setUI
								<span className="text-cyan-500">
									:function
								</span>{" "}
								<span className="text-slate-500">
									{
										"Guarda la nueva configuración de UI, setUI({...UI})"
									}
								</span>
							</li>

							<li>
								__
								<span className="text-cyan-500">
									:function
								</span>{" "}
								<span className="text-slate-500">
									{
										'Traduce el texto de ingles a el idioma especificado por UI.Lang, __("Text")'
									}
								</span>
							</li>
							<li>
								toggleUIMode
								<span className="text-cyan-500">
									:function
								</span>{" "}
								<span className="text-slate-500">
									{
										"Alterna el modo de la UI entre, system, light y dark"
									}
								</span>
							</li>
						</ul>
					</div>
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
		</Layout>
	);
}
