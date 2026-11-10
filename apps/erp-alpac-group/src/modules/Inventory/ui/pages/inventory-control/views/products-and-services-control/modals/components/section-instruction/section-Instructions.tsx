export const SectionInstruction = function(){
   return (
      <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
         
         <p className="mb-2 text-sm font-medium">
            Al dar de baja este producto:
         </p>

         <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
            <li>Deja de estar disponible para crear nuevas requisiciones.</li>
            <li>Se detiene el control de inventario y de stock asociado.</li>
            <li>No se podrán registrar movimientos de entrada ni de salida.</li>
         </ul>
      </div>
   )
}