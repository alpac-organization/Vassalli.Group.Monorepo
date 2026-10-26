import { Button, Dropdown } from "@alpac/design-system"
import { dropdownClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style"

export const StockControlSectionFilters = function(){
	return (
		<div className="flex gap-5 justify-between items-end">
			<div className="flex gap-5">
				<Dropdown 
					label="Categoria"
					options={[]}
					placeholder="Seleccionar Catagoria"
					className={dropdownClassName}
					labelClassName={labelClassName}
				/>

				<Dropdown 
					label="Categoria"
					options={[]}
					placeholder="Seleccionar Catagoria"
					className={dropdownClassName}
					labelClassName={labelClassName}
				/>

				<Dropdown 
					label="Categoria"
					options={[]}
					placeholder="Seleccionar Catagoria"
					className={dropdownClassName}
					labelClassName={labelClassName}
				/>
			</div>


         <section className="flex gap-5">
            <div className="flex flex-col">
               <Button
                  type="submit"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  label="Aplicar filtros"
               />
            </div>

            <div className="flex flex-col">
               <Button
                  type="button"
                  size="giant"
                  className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                  label="Limpiar filtros"
               />
            </div>
         </section>
		</div>
	)
}