import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Log from "./component/log";

export default function Console({
	hbartitle = 0,
	noview,
	content,
	setNoview,
	open,
	setOpen,
}) {
	return (
		<div
			className="fixed bottom-0 left-0 z-[1000] w-full bg-slate-50 border-t-2 border-t-slate-300 flex flex-col duration-300 "
			style={{ height: open ? `calc(100% - ${hbartitle}px)` : "auto" }}
		>
			<div
				className={
					"px-4 flex justify-between cursor-pointer duration-300 rounded-lg " +
					(open
						? "bg-slate-200 text-slate-800"
						: " bg-white text-slate-400")
				}
				onClick={() => {
					setNoview((noview = 0));
					setOpen((open = !open));
				}}
			>
				<div>Console {noview > 0 && `(${noview})`}</div>
				<div className="text-5xl flex justify-center items-center">
					<div className="h-0 overflow-visible -translate-y-6">
						<Icon id={open ? "arrow_drop_up" : "arrow_drop_down"} />
					</div>
				</div>
			</div>
			{open && (
				<div className="flex-1  overflow-y-auto overflow-x-hidden">
					{Object.keys(content)
						.reverse()
						.map((x) => (
							<Log key={x} data={content[x]} />
						))}
				</div>
			)}
		</div>
	);
}
