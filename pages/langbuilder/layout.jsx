import { Fragment, cloneElement, Children, isValidElement } from "react";
import LinkTo from "../../components/LinkTo";

export default function Layout({ children }) {
	//!----------------------[Obtiene Children]-------------------------
	//?---Obtiene la lista de children que se puede renderizar
	let childs = Children.toArray(children).filter((child) =>
		isValidElement(child)
	);
	//!------------------------[ Retornar HTML ]-----------------------------------
	//?---Dentro de Fragment cualquier HTML que envuelva a cloneElement
	//?---cloneElement(child, obj) siendo obj las propiedades a pasar al hijo (key obligatorio)
	return (
		<Fragment>
			<div className="shadow border-[0.2vmin] border-rose-700 rounded p-[2vmin] m-[2vmin]">
				<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
					Layout Plantilla 📋
					<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
						pages/plantilla/layout.jsx
					</span>
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
				<div>
					{childs.map((child, index) =>
						cloneElement(child, { key: index })
					)}
				</div>
			</div>
		</Fragment>
	);
}
