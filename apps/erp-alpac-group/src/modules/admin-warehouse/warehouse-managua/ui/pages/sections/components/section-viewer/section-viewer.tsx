import type { SectionViewerProps } from "./section-viewer.types";

export const SectionViewer = ({ className }: SectionViewerProps) => {

   return (
      <section className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}>
         Testing
      </section>
   );
}