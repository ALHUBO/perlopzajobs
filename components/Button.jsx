export default function Button({
	children,
	className = "",
	onClick = () => {
		return;
	},
	...props
}) {
	return (
		<button
			className={
				" bg-slate-100 text-slate-600 border-2 border-slate-800 rounded-lg px-6 my-1 text-lg enabled:active:scale-90 enabled:active:opacity-80 duration-200 enabled:hover:scale-110 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer" +
				className
			}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
}
