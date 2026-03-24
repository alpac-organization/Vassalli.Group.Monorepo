import { Button } from "@alpac/design-system"
import AlpacLogo from "../../../assets/logos/blanco/alpac.png"

export const Navbar = function(){
   return (
      <nav className="bg-[#272b34] h-25 border-b border-slate-600">
         <div className="max-w-330 flex h-full justify-between m-auto">
            <div>
               <img className="h-full p-3" src={AlpacLogo} alt="logo alpac" />
            </div>
            <div>
               <Button label="Hola mundo" />
            </div>
         </div>
      </nav>
   )
}