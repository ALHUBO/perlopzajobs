import { useEffect } from "react";
import LinkTo from "../../components/LinkTo";
import Layout from "./layout";

export default function Page({ UI, setUI, __, toggleUIMode }) {
	useEffect(() => {
		UI.Title = "Lang Builder";
		setUI({ ...UI });
		app.on("lang-list", (data) => {
			console.log(data);
		});
		app.send("lang-list", null);
	}, []);
	return (
		<Layout>
			<div>Constructor de Idiomas</div>
		</Layout>
	);
}
