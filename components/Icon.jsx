export default function Icon({ id = "error", className = "", fill = false }) {
	return (
		<span
			className={
				(fill ? "icon-fill " : "icon-no-fill ") + "icon " + className
			}
		>
			{id}
		</span>
	);
}
