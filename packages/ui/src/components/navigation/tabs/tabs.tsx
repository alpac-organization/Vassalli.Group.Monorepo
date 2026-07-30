import { useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { TabHeader } from "../tabs-header/tabs-header";
import { TabProps } from "./tabs.type";

const loadFeatures = () =>
	import("framer-motion").then((res) => res.domAnimation);

const tabPanelVariants = {
	enter: {
		opacity: 0,
	},
	center: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

export function Tabs(props: TabProps<string>): React.ReactNode {
	const [activeTab, setActiveTab] = useState(props.activeTab);

	const activeItem = props.tabItems.find((item) => item.id === activeTab);

	const handleTabChange = (nextTab: string) => {
		setActiveTab(nextTab);
	};

	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			<TabHeader
				tabs={props.tabItems}
				activeTab={activeTab}
				onTabChange={handleTabChange}
			/>

			<div className="relative w-full min-w-0 overflow-hidden">
				<LazyMotion features={loadFeatures} strict>
					<AnimatePresence mode="wait" initial={false}>
						{activeItem && (
							<m.div
								key={activeItem.id}
								role="tabpanel"
								variants={tabPanelVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{ duration: 0.22, ease: "easeOut" }}
								className="w-full min-w-0"
							>
								{activeItem.render(activeItem.id)}
							</m.div>
						)}
					</AnimatePresence>
				</LazyMotion>
			</div>
		</div>
	);
}
