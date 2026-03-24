export const Loader = function({ title = "Cargando módulos..."}: { title?: string }){
   return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#1a1f2b]/60 backdrop-blur-[1px] transition-opacity">
         
         <section className="flex flex-col items-center gap-5 p-8 rounded-2xl">
            <span className="loader"></span> 
            
            <p className="text-gray-300 text-sm font-medium animate-pulse tracking-wide">
               { title }
            </p>
         </section>
      </div>
   )
}