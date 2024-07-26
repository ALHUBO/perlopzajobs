// Layout.js
import {
	useState,
	useEffect,
	Fragment,
	cloneElement,
	Children,
	isValidElement,
} from "react";
import Access from "./access";
import Console from "./Console/Main";
import Bartitle from "./Bartitle/main";

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

	const [backEnd, setbackEnd] = useState({
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
		setFrontEnd(frontEnd);
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

	const logOut = () => {
		backEnd.title = "Ingresar Contraseña";
		backEnd.access.can = false;
		setbackEnd(backEnd);
	};

	const loadDataConection = () => {
		let dbc = localStorage.getItem("config.db");
	};

	//!---------------------------[ Despues de cargar el DOM ]------------------------------
	useEffect(() => {}, []);

	return (
		<Fragment>
			<Bartitle
				height={frontEnd.screen.hbartitle}
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
			/>
			<Access
				frontEnd={frontEnd}
				setFrontEnd={setFrontEnd}
				backEnd={backEnd}
				setbackEnd={setbackEnd}
			/>
			{typeof backEnd.access.exists == "boolean" &&
				backEnd.access.exists &&
				typeof backEnd.access.can == "string" && (
					<>
						<div className="shadow bg-slate-100 dark:bg-slate-700 min-h-[100vh]">
							<div className="text-[2.5vmin] text-slate-600 dark:text-slate-100 font-bold">
								Layout parent 📋
								<span className="text-[1.6vmin] text-white dark:text-slate-800 bg-slate-600 dark:bg-slate-100 px-[1vmin] py-[0.2vmin] shadow rounded font-thin italic ml-[2vmin]">
									layout/main.jsx
								</span>
								<button onClick={logOut}>Log out</button>
							</div>

							<main
								className="overflow-x-hidden overflow-y-auto"
								style={{ height: "calc(100vh - 12.8vmin)" }}
							>
								{childs.map((child, index) =>
									cloneElement(child, {
										key: index,
										frontEnd,
										setFrontEnd,
										backEnd,
										setbackEnd,
									})
								)}
							</main>
						</div>
						<Console
							frontEnd={frontEnd}
							setFrontEnd={setFrontEnd}
						/>
					</>
				)}
		</Fragment>
	);
}
