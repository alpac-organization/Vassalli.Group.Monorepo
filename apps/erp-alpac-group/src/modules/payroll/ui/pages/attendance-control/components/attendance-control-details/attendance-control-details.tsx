import { Modal } from "@alpac/design-system";
import { formatTime } from "@app/shared/utils/string.utils";
import type { AttendanceControlDetailProps } from "./attendance-control-details.types";

export const AttendanceControlDetail = (props: AttendanceControlDetailProps) => {

    const markings = props.attendanceDetail ?? [];

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={() => props.onClose?.()}
            variant="default"
            title="Detalle de marcaciones"
            panelClassName={[
                "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
                "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
                "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
                "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
            ].join(" ")}
        >
            <div className="flex min-w-0 flex-col gap-5">
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
                    <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-3 dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Marcación
                        </div>
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Hora
                        </div>
                        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Dispositivo
                        </div>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                        {markings.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                No hay marcaciones registradas.
                            </div>
                        ) : (
                            markings.map((marking, index) => (
                                <div
                                    key={`${marking.read_time}-${index}`}
                                    className="grid grid-cols-1 gap-1 px-3 py-3 sm:grid-cols-3 sm:items-center sm:gap-0"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                        Marcación
                                    </span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Marcación {index + 1}
                                    </span>

                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                        Hora
                                    </span>
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        {formatTime(marking.read_time)}
                                    </span>

                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                        Dispositivo
                                    </span>
                                    <span className="text-sm text-slate-700 dark:text-slate-200">
                                        {marking.device_name?.trim() || "—"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
