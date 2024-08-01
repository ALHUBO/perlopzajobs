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

export default function Layout({ children }) {
	const childs = Children.toArray(children).filter((child) =>
		isValidElement(child)
	);

	let [frontEnd, setFrontEnd] = useState({
		title: "ALHUBOSoft",
		lang: {
			act: "noneLang",
			list: {},
		},
		theme: { mode: "system", dark: false },
		screen: {
			width: 100,
			height: 100,
			full: false,
			maximize: false,
			hbartitle: 4,
		},
		console: {
			open: false,
			noview: 0,
			content: {},
		},
	});

	const [backEnd, setBackEnd] = useState({
		access: {
			exists: null,
			pass: "",
			can: false,
			wait: false,
		},
		db: {
			stablished: false,
			data: { ip: "", port: "", user: "", pass: "", db: "", driver: "" },
		},
	});

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

	const canAccess = () => {
		if (typeof backEnd.access.exists == "boolean")
			if (backEnd.access.exists)
				if (
					typeof backEnd.access.can == "string" &&
					backEnd.access.can != ""
				)
					return 0; //?---Tiene acceso
				else return 1;
			//?---Cargó pero no tiene acceso
			else return 2; //?---Cargó pero no existe archivo acceso

		return 3; //?---Esta Cargando archivo acceso
	};

	//!---------------------------[ Despues de cargar el DOM ]------------------------------
	useEffect(() => {
		app.on("db-is-connect", (response) => {
			backEnd.db.stablished = response;
			setBackEnd({
				...backEnd,
			});
		});

		app.on("db-data", (response) => {
			backEnd.db.data = {
				ip: response.host,
				port: response.port,
				user: response.user,
				pass: response.password,
				db: response.database,
				driver: response.driver,
			};
			setBackEnd({
				...backEnd,
			});
			app.send("db-is-connect", null);
		});

		app.send("db-data", null);
	}, []);

	return (
		<Fragment>
			<Bartitle
				height={frontEnd.screen.hbartitle}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
			/>
			<Access
				canAccess={canAccess}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
				backEnd={backEnd}
				setBackEnd={setBackEnd}
			/>
			<Workspace
				canAccess={canAccess}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
				backEnd={backEnd}
				setBackEnd={setBackEnd}
			>
				{childs.map((child, index) =>
					cloneElement(child, {
						key: index,
						frontEnd,
						setFrontEnd,
						backEnd,
						setBackEnd,
					})
				)}
			</Workspace>
		</Fragment>
	);
}
