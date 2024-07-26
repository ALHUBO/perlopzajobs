import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import LinkTo from "../components/LinkTo";
import TagTo from "../components/TagTo";
export default function Page({ __, frontEnd, setFrontEnd }) {
	useEffect(() => {
		frontEnd.Title = "Pagina Principal";
		setFrontEnd({ ...frontEnd });
	}, []);
	return (
		<div className="shadow border-[0.2vmin] border-slate-600 dark:border-slate-100 rounded p-[2vmin] bg-slate-100 dark:bg-slate-700">
			<Link href="/config">Configuración</Link>
		</div>
	);
}
