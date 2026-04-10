import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { StepperProps } from './stepper.type';

export const Stepper = ({
   steps,
   currentStep,
   className = '',
}: StepperProps): React.ReactNode => {
   return (
      <div className={`w-full py-8 ${className}`}>
         <div className="flex items-center w-full">
            {steps.map((label, index) => {
               const isCompleted = index < currentStep;
               const isActive = index === currentStep;
               const isLast = index === steps.length - 1;
               const isFirst = index === 0;

               // Color logic for connecting lines
               const getLineColor = (side: 'left' | 'right') => {
                  if (side === 'left') {
                     if (isFirst) return 'bg-transparent';
                     return isCompleted || isActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-300';
                  } else {
                     if (isLast) return 'bg-transparent';
                     return isCompleted ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-300';
                  }
               };

               return (
                  <div key={label} className="flex-1 flex items-center relative">
                     {/* Left Connector Line */}
                     <div className={`h-0.5 flex-1 transition-colors duration-500 ${getLineColor('left')}`} />

                     {/* Step Node (Circle + Label) */}
                     <div className="relative flex flex-col items-center mx-1 z-10">
                        {/* Circle */}
                        <motion.div
                           initial={false}
                           animate={{
                              backgroundColor: isCompleted
                                 ? '#10b981'
                                 : isActive
                                    ? '#2563eb'
                                    : '#f1f5f9',
                              borderColor: isCompleted
                                 ? '#10b981'
                                 : isActive
                                    ? '#2563eb'
                                    : '#cbd5e1',
                              color: isCompleted || isActive ? '#ffffff' : '#475569',
                              scale: isActive ? 1.15 : 1,
                           }}
                           className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                    dark:bg-slate-400 transition-all duration-300
                    ${isActive ? 'shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10' : ''}
                  `}
                        >
                           {isCompleted ? (
                              <motion.div
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 transition={{ type: 'spring', damping: 20 }}
                              >
                                 <Check size={20} strokeWidth={3} />
                              </motion.div>
                           ) : (
                              <span>{index + 1}</span>
                           )}
                        </motion.div>

                        {/* Label (Absolute positioning to prevent line displacement) */}
                        <motion.span
                           animate={{
                              fontWeight: isActive ? 700 : 500,
                              opacity: isActive || isCompleted ? 1 : 0.7,
                           }}
                           className={`absolute top-12 whitespace-nowrap text-[10px] uppercase tracking-wider text-center 
                              ${isActive ? 'text-slate-800 dark:text-white' :
                                 isCompleted ? 'text-slate-500 dark:text-slate-400' :
                                    'text-slate-500 dark:text-slate-400'}
                           `}
                        >
                           {label}
                        </motion.span>
                     </div>

                     {/* Right Connector Line */}
                     <div className={`h-0.5 flex-1 transition-colors duration-500 ${getLineColor('right')}`} />
                  </div>
               );
            })}
         </div>
      </div>
   );
};
