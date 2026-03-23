import Logo from "../../../assets/logos/blanco/alpac.png"

export const ContentLoaded = function(){
   return (
      <div className="min-h-screen bg-alpac-primary-700 flex justify-center items-center">
         <section className="flex flex-col items-center text-xl gap-7">
            <img 
               src={Logo} 
               width={90}  
               alt="logo alpac"
            />
            <span className="loader"></span>
         </section>
      </div>
   )
}
