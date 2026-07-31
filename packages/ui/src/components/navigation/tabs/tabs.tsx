import { useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { TabHeader } from "../tabs-header/tabs-header";
import { TabProps } from "./tabs.type";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const tabPanelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
  }),
};

export function Tabs(props: TabProps<string>): React.ReactNode {
  const [activeTab, setActiveTab] = useState(props.activeTab);
  const [direction, setDirection] = useState(0);

  const activeItem = props.tabItems.find((item) => item.id === activeTab);
  const keepMounted = props.keepMounted === true;

  const handleTabChange = (nextTab: string) => {
    const currentIndex = props.tabItems.findIndex(
      (item) => item.id === activeTab,
    );
    const nextIndex = props.tabItems.findIndex((item) => item.id === nextTab);

    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveTab(nextTab);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <TabHeader
        tabs={props.tabItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="relative w-full min-w-0 overflow-x-hidden overflow-y-visible">
        {keepMounted ? (
          props.tabItems.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <div
                key={item.id}
                role="tabpanel"
                hidden={!isActive}
                aria-hidden={!isActive}
                className={`w-full min-w-0 ${isActive ? "" : "hidden"}`}
              >
                {item.render(item.id)}
              </div>
            );
          })
        ) : (
          <LazyMotion features={loadFeatures} strict>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {activeItem && (
                <m.div
                  key={activeItem.id}
                  role="tabpanel"
                  custom={direction}
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
        )}
      </div>
    </div>
  );
}
