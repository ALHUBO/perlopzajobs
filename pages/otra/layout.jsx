import { Fragment, cloneElement, Children, isValidElement } from "react";

export default function Layout({ children }) {
	//!---------------------------[ Despues de cargar el DOM ]------------------------------
	let childs = Children.toArray(children).filter((child) =>
		isValidElement(child)
	);
	return (
		<Fragment>
			<div className="shadow border-[0.2vmin] border-rose-700 dark:border-rose-300 rounded p-[2vmin] m-[2vmin]">
				<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
					Layout de otra pagina 📋
					<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
						pages/otra/layout.jsx
					</span>
				</div>
				<main>
					{childs.map((child, index) =>
						cloneElement(child, { key: index })
					)}
				</main>
			</div>
		</Fragment>
	);
}
