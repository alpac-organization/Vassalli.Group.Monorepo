import { Fragment } from "react"

export const CopyRight = function () {
   return (
      <Fragment>
         <p className="text-center text-[10px]! md:text-[12px]! text-gray-400">
            © {new Date().getFullYear()} Almacenadora del pacífico.❤️Todos los derechos reservados.
         </p>
      </Fragment>
   )
}