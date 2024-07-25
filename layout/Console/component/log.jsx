import Icon from "../../../components/Icon";

export default function Log({ data }) {
	return (
		<div
			className={
				"border-2 rounded-lg px-2 " +
				(data.type == "default"
					? " bg-slate-100 border-slate-400"
					: data.type == "success"
					? " bg-lime-100 border-lime-400"
					: data.type == "info"
					? " bg-cyan-100 border-cyan-400"
					: data.type == "warning"
					? " bg-amber-100 border-amber-400"
					: data.type == "error"
					? " bg-red-100 border-red-400"
					: " ")
			}
		>
			<div className="text-base font-bold text-slate-600 flex justify-between items-center gap-1">
				<div className=" flex justify-start items-center gap-1">
					<Icon id={data.icon} className="text-2xl" /> {data.title}
				</div>
				<div>{data.date}</div>
			</div>
			<div className="text-sm text-slate-500">{data.content}</div>
			{(typeof data.advanced != "string" ||
				(typeof data.advanced == "string" && data.advanced != "")) && (
				<div className="py-2 px-8">
					<details className="text-sm">
						<summary>Advanced</summary>
						<div className="border-2 border-slate-700 py-2 px-6 rounded-lg bg-white">
							{typeof data.advanced.message == "string"
								? data.advanced.message
								: data.advanced}
						</div>
					</details>
				</div>
			)}
		</div>
	);
}
