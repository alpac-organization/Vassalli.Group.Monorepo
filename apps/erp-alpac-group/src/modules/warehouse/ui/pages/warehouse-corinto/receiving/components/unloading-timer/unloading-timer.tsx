export const UnloadingTimer = () => {

   return (
      <div className="flex items-center justify-center">

         <div className="flex items-center space-x-3 bg-black/40 rounded-lg border border-emerald-500/20 p-6">


            <div className="flex flex-col items-center">
               <span contentEditable className="font-mono text-4xl font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">
                  12
               </span>
               <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium mt-1">MIN</span>
            </div>


            <span className="font-mono text-4xl font-bold text-emerald-400 animate-pulse bottom-1 relative">:</span>


            <div className="flex flex-col items-center">
               <span contentEditable className="font-mono text-4xl font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">
                  45
               </span>
               <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium mt-1">SEG</span>
            </div>


            <span className="font-mono text-4xl font-bold text-emerald-400 animate-pulse bottom-1 relative">:</span>


            <div className="flex flex-col items-center presentation">
               <span contentEditable className="font-mono text-4xl font-bold tracking-widest text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">
                  89
               </span>
               <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium mt-1">MS</span>
            </div>

         </div>
      </div>
   );
}