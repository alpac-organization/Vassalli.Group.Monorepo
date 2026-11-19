import type { ReactNode } from "react";

export type FlowStepProps = {
   icon:          ReactNode;
   caption:       string;
   title:         string;
   highlighted?: boolean;
};