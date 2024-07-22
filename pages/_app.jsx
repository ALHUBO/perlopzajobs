import React from "react";

import "./globals.css";
import Layout from "../layout/main";

function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;
