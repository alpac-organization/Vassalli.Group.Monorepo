import { m, LazyMotion } from "framer-motion";
import { Check, Clock3, X } from "lucide-react";
import { StepperProps } from "./stepper.type";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const Stepper = ({
  steps,
  currentStep,
  className = "",
  stepStatuses,
}: StepperProps): React.ReactNode => {
  const isStatusMode =
    stepStatuses !== undefined && stepStatuses.length === steps.length;

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className={`w-full py-8 ${className}`}>
        <div className="flex items-center w-full">
          {steps.map((label, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isLast = index === steps.length - 1;
            const isFirst = index === 0;
            const stepStatus = isStatusMode ? stepStatuses[index] : undefined;
            const previousStepStatus =
              isStatusMode && index > 0 ? stepStatuses[index - 1] : undefined;
            const isApprovedStep = stepStatus === "approved";
            const isPendingStep = stepStatus === "pending";

            const getLineColor = (side: "left" | "right") => {
              if (isStatusMode) {
                const getStatusColorClass = (status: typeof stepStatus) => {
                  if (status === "approved") return "bg-emerald-500";
                  if (status === "pending") return "bg-amber-500";
                  return "bg-rose-500";
                };

                if (side === "left") {
                  if (isFirst) return "bg-transparent";
                  return getStatusColorClass(previousStepStatus);
                }
                if (isLast) return "bg-transparent";
                return getStatusColorClass(stepStatus);
              }

              if (side === "left") {
                if (isFirst) return "bg-transparent";
                return isCompleted || isActive
                  ? "bg-blue-600"
                  : "bg-slate-200 dark:bg-slate-300";
              } else {
                if (isLast) return "bg-transparent";
                return isCompleted
                  ? "bg-blue-600"
                  : "bg-slate-200 dark:bg-slate-300";
              }
            };

            return (
              <div key={label} className="flex-1 flex items-center relative">
                {/* Left Connector Line */}
                <div
                  className={`h-0.5 flex-1 transition-colors duration-500 ${getLineColor("left")}`}
                />

                <div className="relative flex flex-col items-center mx-1 z-10">
                  <m.div
                    initial={false}
                    animate={{
                      backgroundColor: isStatusMode
                        ? isApprovedStep
                          ? "#10b981"
                          : isPendingStep
                            ? "#f59e0b"
                            : "#ef4444"
                        : isCompleted
                          ? "#10b981"
                          : isActive
                            ? "#2563eb"
                            : "#f1f5f9",
                      borderColor: isStatusMode
                        ? isApprovedStep
                          ? "#10b981"
                          : isPendingStep
                            ? "#f59e0b"
                            : "#ef4444"
                        : isCompleted
                          ? "#10b981"
                          : isActive
                            ? "#2563eb"
                            : "#cbd5e1",
                      color: isStatusMode
                        ? "#ffffff"
                        : isCompleted || isActive
                          ? "#ffffff"
                          : "#475569",
                      scale: isStatusMode ? 1 : isActive ? 1.15 : 1,
                    }}
                    className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                      dark:bg-slate-400 transition-all duration-300
                      ${isStatusMode ? "" : isActive ? "shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10" : ""}
                    `}
                  >
                    {isStatusMode ? (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 20 }}
                      >
                        {isApprovedStep ? (
                          <Check size={20} strokeWidth={3} />
                        ) : isPendingStep ? (
                          <Clock3 size={20} strokeWidth={3} />
                        ) : (
                          <X size={20} strokeWidth={3} />
                        )}
                      </m.div>
                    ) : isCompleted ? (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 20 }}
                      >
                        <Check size={20} strokeWidth={3} />
                      </m.div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </m.div>

                  {/* Label (Absolute positioning to prevent line displacement) */}
                  <m.span
                    animate={{
                      fontWeight: isStatusMode ? 600 : isActive ? 700 : 500,
                      opacity: isStatusMode
                        ? 1
                        : isActive || isCompleted
                          ? 1
                          : 0.7,
                    }}
                    className={`absolute top-12 whitespace-nowrap text-[10px] uppercase tracking-wider text-center 
                                ${
                                  isStatusMode
                                    ? isApprovedStep
                                      ? "text-emerald-400"
                                      : isPendingStep
                                        ? "text-amber-400"
                                        : "text-rose-400"
                                    : isActive
                                      ? "text-slate-800 dark:text-white"
                                      : isCompleted
                                        ? "text-slate-500 dark:text-slate-400"
                                        : "text-slate-500 dark:text-slate-400"
                                }
                             `}
                  >
                    {label}
                  </m.span>
                </div>

                {/* Right Connector Line */}
                <div
                  className={`h-0.5 flex-1 transition-colors duration-500 ${getLineColor("right")}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
};
