// Layout.js
import {
	useState,
	useEffect,
	Fragment,
	cloneElement,
	Children,
	isValidElement,
} from "react";
import Access from "./Access/main";
import Bartitle from "./Bartitle/main";
import Workspace from "./Workspace/main";
import Icon from "../components/Icon";
import Console from "./Console/main";
import ErrorPegi from "./ErrorPegi/main";

export default function Layout({ children }) {
	const [erConf, setErConf] = useState(null);
	const [loaded, setLoaded] = useState(false);

	const childs = Children.toArray(children).filter((child) =>
		isValidElement(child)
	);

	const toggleThemeMode = () => {
		let ch = "system";
		if (frontEnd.theme.mode == "system") {
			ch = "light";
			frontEnd.theme.dark = false;
		} else if (frontEnd.theme.mode == "light") {
			ch = "dark";
			frontEnd.theme.dark = true;
		}
		frontEnd.theme.mode = ch;
		setFrontEnd({ ...frontEnd });
		app.send("nativetheme-get", ch);
	};

	function __(txt) {
		if (typeof txt != "string") return "It's not possible to translate";
		if (frontEnd.lang.act == "en") return txt;
		if (typeof frontEnd.lang.list.en == "undefined") return txt;
		let n = frontEnd.lang.list.en[txt];
		if (
			typeof n != "undefined" &&
			typeof frontEnd.lang.list[frontEnd.lang.act] != "undefined" &&
			typeof frontEnd.lang.list[frontEnd.lang.act][n] != "undefined"
		) {
			return frontEnd.lang.list[frontEnd.lang.act][n];
		} else return txt;
	}

	const loadDataConection = () => {
		let dbc = localStorage.getItem("config.db");
	};

	//!---------------------------[ Despues de cargar el DOM ]------------------------------
	useEffect(() => {
		app.on("config-load", (response) => {
			if (response.ok) setLoaded(true);
			else setErConf(response.sms);
		});
		app.on("config-save", (response) => {
			if (response.ok) {
				localStorage.setItem("config.shifer", response.sms);
			} else setErConf(response.sms);
		});

		app.send("config-load", localStorage.getItem("config.shifer"));
		app.send("config-safearea-get", null);
	}, []);

	return (
		<Fragment>
			<Bartitle />
			{typeof erConf == "string" ? (
				<ErrorPegi title="Configuration error" error={erConf} />
			) : loaded ? (
				<>
					<Access />
					{/* <Workspace>
						{childs.map((child, index) =>
							cloneElement(child, {
								key: index,
							})
						)}
					</Workspace> */}
				</>
			) : (
				<div
					className="flex justify-center items-center flex-col gap-12 text-slate-600"
					style={{ height: "100vh" }}
				>
					<div className="flex justify-center items-center gap-1 text-3xl">
						Cargando configuracion...
						<Icon id="autorenew" />
					</div>
					<div className="loader"></div>
				</div>
			)}
		</Fragment>
	);
}
