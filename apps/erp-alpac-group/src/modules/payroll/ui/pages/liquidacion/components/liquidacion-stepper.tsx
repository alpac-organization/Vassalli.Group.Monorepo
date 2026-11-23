import { Stepper } from "@alpac/design-system";
import { LIQUIDACION_STEPS } from "../constants/liquidacion-mock.constants";

interface LiquidacionStepperProps {
  currentStep: number;
}

export function LiquidacionStepper({ currentStep }: LiquidacionStepperProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-600 bg-white px-4 pb-8 dark:border-neutral-600 dark:bg-[#272b34]">
      <div className="min-w-[32rem]">
        <Stepper steps={LIQUIDACION_STEPS} currentStep={currentStep} />
      </div>
    </div>
  );
}
