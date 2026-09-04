import { SectionHeaderProps } from "./section-header.types";

export const SectionHeader = ({ title, subtitle, logoImage, headerClassName, hasBorder, children }: SectionHeaderProps) => {

	const border = hasBorder ? "pt-4 border-t border-t-slate-600 dark:border-t-neutral-600" : "";

	return (
		<div className="flex flex-col gap-4">
			<div className={`flex justify-between items-center ${border} ${headerClassName}`}>
				<div className="flex min-w-0 flex-col justify-center">
					<h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
						{title}
					</h3>
					{subtitle ? <small className="mt-1 text-gray-500 dark:text-gray-300 text-[16px]!">
						{subtitle}
					</small> : null
					}

				</div>
				{logoImage ?
					<img
						src={logoImage}
						alt={title}
						className="h-12 sm:h-16 md:h-20 w-auto object-contain shrink-0"
						loading="lazy"
						decoding="async"
					/> : null
				}
			</div>
			{children &&
				<div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
					<div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
						{children}
					</div>
				</div>
			}
		</div>
	);
}