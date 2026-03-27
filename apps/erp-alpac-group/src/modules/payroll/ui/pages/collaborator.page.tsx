import { Breadcrumb, StatsCard } from "@alpac/design-system"
import { useImage } from "@app/shared/hooks/useImage"
import { useUserStore } from "@app/shared/stores/useUserStore"
import { motion } from "framer-motion"
import { UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const CollaboratorPage = function () {

    const navigate = useNavigate()

    const { companyAlias } = useUserStore()

    const companyAliasWhite = companyAlias.toLowerCase().concat(".white")

    const { urlImage } = useImage(companyAliasWhite)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2">

            <div className="flex justify-start">
                <Breadcrumb items={[
                    { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
                    { label: "Colaboradores", url: "/payroll/collaborators", onClick: (url) => navigate(url) },
                ]} />
            </div>

            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-center">
                        <h3 className="p-0! m-0!">Colaboradores</h3>
                        <small className="text-gray-500 dark:text-gray-300">Descripcion de colaboradores y sus estadisticas</small>
                    </div>
                    <img className="h-10 sm:h-14 md:h-16 w-auto object-contain" src={urlImage} alt="logo alpac" />
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Collaborator" value="100" icon={<UserIcon size={30} />} />
                <StatsCard title="Collaborator" value="100" icon={<UserIcon size={30} />} />
                <StatsCard title="Collaborator" value="100" icon={<UserIcon size={30} />} />
                <StatsCard title="Collaborator" value="100" icon={<UserIcon size={30} />} />
            </div>
        </motion.div>
    )
}