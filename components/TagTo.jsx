import Icon from "./Icon";
export default function TagTo({
	licon,
	ricon,
	direction,
	title,
	desc,
	onClick,
}) {
	return (
		<div
			onClick={onClick}
			className="group rounded-lg cursor-pointer border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
		>
			<div className="mb-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">
				{licon ? (
					<span
						className={
							"inline-block font-firacode transition-transform translate-y-1 group-hover:" +
							(direction ? "-translate-y-1" : "translate-y-2") +
							" motion-reduce:transform-none"
						}
					>
						<Icon id={licon} />
					</span>
				) : null}
				{" " + title + " "}
				{ricon ? (
					<span
						className={
							"inline-block font-firacode transition-transform translate-y-1 group-hover:" +
							(direction ? "-translate-y-1" : "translate-y-2") +
							" motion-reduce:transform-none"
						}
					>
						<Icon id={ricon} />
					</span>
				) : null}
			</div>
			<div className="m-0 max-w-[30ch] text-sm opacity-50 text-slate-900 dark:text-white">
				{desc}
			</div>
		</div>
	);
}
