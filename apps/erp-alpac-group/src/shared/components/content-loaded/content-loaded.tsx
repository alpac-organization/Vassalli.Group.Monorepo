import Logo from "../../../assets/logos/blanco/grupo vassalli-logo.png"

export const ContentLoaded = function(){
   return (
      <div className="min-h-screen bg-alpac-primary-700 flex justify-center items-center">
         <section className="flex flex-col items-center text-xl gap-7">
            <img 
               src={Logo} 
               width={90}  
               alt="logo por defecto"
            />
            <span className="loader"></span>
         </section>
      </div>
   )
}
