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

export default function Layout({ children }) {
	let [erConf, setErConf] = useState("");
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
		ip: "",
		udp: {
			stablished: false,
			auto: false,
			data: {
				port: { E: 56789, S: 56790 },
			},
		},
		ws: { stablished: false, auto: false, data: { port: 3000 } },
		db: {
			stablished: false,
			auto: false,
			data: {
				ip: "localhost",
				port: 3306,
				user: "root",
				pass: "",
				db: "PerlopzaJobs",
				driver: "",
			},
		},
		access: {
			exists: null,
			can: false,
			pass: "",
			wait: false,
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
		app.on("config-load", (response) => {
			if (response.error) {
				setErConf((erConf = response.sms));
			} else setBackEnd({ ...response.sms });
		});

		app.on("config-save", (response) => {
			if (!response.error) {
				localStorage.setItem("config.shifer", response.sms);
				setBackEnd({ ...backEnd });
			} else console.log(response);
		});

		app.send("config-load", localStorage.getItem("config.shifer"));
	}, []);

	return (
		<Fragment>
			<Bartitle
				height={frontEnd.screen.hbartitle}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
				backEnd={backEnd}
				setBackEnd={setBackEnd}
				canAccess={canAccess}
			/>
			{erConf == "" ? (
				<>
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
				</>
			) : (
				<>
					<div
						className="flex justify-center items-center flex-col"
						style={{
							height: frontEnd.console.open
								? "0px"
								: "calc(100vh - " +
								  frontEnd.screen.hbartitle * 2 +
								  "px)",
						}}
					>
						<div className="text-9xl text-red-700">
							<Icon id="code_blocks" />
						</div>
						<div className="font-bold text-3xl text-slate-700">
							Error en configuración
						</div>
						<div className="text-lg text-slate-500 px-[20%]">
							{erConf}
						</div>
					</div>
					<Console
						safeArea={frontEnd.screen.hbartitle}
						frontEnd={frontEnd}
						setFrontEnd={setFrontEnd}
					/>
				</>
			)}
		</Fragment>
	);
}
