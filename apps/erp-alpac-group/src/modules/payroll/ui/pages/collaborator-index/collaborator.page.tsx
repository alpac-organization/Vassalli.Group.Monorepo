import { Breadcrumb, StatsCard, DataTable, type TableColumn, InputText, Dropdown, Button, Badges } from "@alpac/design-system"
import { useImage } from "@app/shared/hooks/useImage"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { motion } from "framer-motion"
import { HospitalIcon, TreePalmIcon, UserIcon, UserRoundPlusIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Collaborator } from "./collaborator.page.types"
import { useState } from "react"

export const CollaboratorPage = function () {

    const [position, setPosition] = useState<string>("")

    const navigate = useNavigate()

    const { companyAlias } = useUserStore()

    const companyAliasWhite = companyAlias.toLowerCase().concat(".white")

    const { urlImage } = useImage(companyAliasWhite)

    const columns: TableColumn[] = [
        { key: "id", label: "ID" },
        { key: "fullName", label: "Nombre Completo" },
        { key: "position", label: "Puesto" },
        { key: "department", label: "Departamento" },
        { key: "status", label: "Estado", render: (item: Collaborator) => <Badges label={item.status} color="bg-green-100 text-green-900" /> },
        { key: "showProfile", label: "Acciones", render: (item: Collaborator) => <Button label={item.showProfile} size="small" className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!" /> }
    ]

    const data = [
        { id: "001", fullName: "Juan Pérez", position: "Desarrollador Senior", department: "Tecnología", status: "Activo", showProfile: "Ver Perfil" },
        { id: "002", fullName: "María García", position: "Analista de RRHH", department: "Recursos Humanos", status: "Activo", showProfile: "Ver Perfil" },
        { id: "003", fullName: "Carlos Rodriguez", position: "Gerente de Ventas", department: "Comercial", status: "Vacaciones", showProfile: "Ver Perfil" },
        { id: "004", fullName: "Lucía Méndez", position: "Diseñadora UX", department: "Producto", status: "Activo", showProfile: "Ver Perfil" },
        { id: "005", fullName: "Roberto Sánchez", position: "Contador", department: "Finanzas", status: "Baja", showProfile: "Ver Perfil" },
    ] as Collaborator[]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4">

            <div className="flex justify-start">
                <Breadcrumb items={[
                    { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
                    { label: "Colaboradores", url: "/payroll/collaborators", onClick: (url) => navigate(url) },
                ]} />
            </div>

            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-center">
                        <h3 className="p-0! m-0!">Colaboradores</h3>
                        <small className="text-gray-500 dark:text-gray-300">Descripcion de colaboradores y sus estadisticas</small>
                    </div>
                    <img className="h-12 sm:h-16 md:h-20 w-auto object-contain" src={urlImage} alt="logo alpac" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Activos" value="100" trend="Incremento del 10%" trendType="up" icon={<UserIcon size={30} />} />
                <StatsCard title="Vacaciones" value="100" trend="Decremento del 10%" trendType="down" icon={<TreePalmIcon size={30} />} />
                <StatsCard title="Subsidios" value="100" trend="Incremento del 10%" trendType="up" icon={<HospitalIcon size={30} />} />
                <StatsCard title="Total" value="100" trend="Decremento del 10%" trendType="down" icon={<UserRoundPlusIcon size={30} />} />
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">

                <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-center">
                        <h3 className="p-0! m-0!">Filtros</h3>
                        <small className="text-gray-500 dark:text-gray-300">Descripcion de filtros</small>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">

                    <div className="flex flex-col">
                        <InputText
                            label="Identificación"
                            className="rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                            type="text"
                            placeholder="Ingrese la identificación"
                        />
                    </div>

                    <div className="flex flex-col">
                        <Dropdown
                            value={position}
                            onChange={(value) => setPosition(value)}
                            label="Posición de trabajo"
                            placeholder="Seleccione una posición de trabajo"
                            labelClassName="text-black! dark:text-white!"
                            valueClassName="text-black! dark:text-white!"
                            className="
                            focus:ring-2! focus:ring-green-50/50!
                            rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! 
                            dark:border-slate-600! dark:hover:border-neutral-600!"
                            options={[
                                { label: "Filter 1", value: "filter1" },
                                { label: "Filter 2", value: "filter2" },
                                { label: "Filter 3", value: "filter3" },
                                { label: "Filter 4", value: "filter4" },
                            ]}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Dropdown
                            label="Área de trabajo"
                            placeholder="Seleccione un área de trabajo"
                            labelClassName="text-black! dark:text-white!"
                            valueClassName="text-black! dark:text-white!"
                            className="
                            focus:ring-2! focus:ring-green-50/50!
                            rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! 
                            dark:border-slate-600! dark:hover:border-neutral-600!"
                            options={[
                                { label: "Filter 1", value: "filter1" },
                                { label: "Filter 2", value: "filter2" },
                                { label: "Filter 3", value: "filter3" },
                                { label: "Filter 4", value: "filter4" },
                            ]}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Dropdown
                            label="Estado"
                            placeholder="Seleccione un estado"
                            labelClassName="text-black! dark:text-white!"
                            valueClassName="text-black! dark:text-white!"
                            className="
                            focus:ring-2! focus:ring-green-50/50!
                            rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! 
                            dark:border-slate-600! dark:hover:border-neutral-600!"
                            options={[
                                { label: "Filter 1", value: "filter1" },
                                { label: "Filter 2", value: "filter2" },
                                { label: "Filter 3", value: "filter3" },
                                { label: "Filter 4", value: "filter4" },
                            ]}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Button
                            size="giant"
                            className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                            label="Aplicar filtros"
                            onClick={() => { console.log("Clicking 1") }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Button
                            size="giant"
                            className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                            label="Limpiar filtros"
                            onClick={() => { console.log("Clicking 2") }}
                        />
                    </div>

                </div>
            </div>

            <div className="flex flex-col">
                <DataTable title="Lista de colaboradores" data={data} columns={columns} />
            </div>
        </motion.div>
    )
}