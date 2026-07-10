// apps/erp-alpac-group/src/modules/warehouse/ui/pages/warehouse-managua/ui/pages/ducas-index/components/duca-header.tsx
import { Breadcrumb } from '@alpac/design-system';
import { useNavigate } from 'react-router-dom';

interface DucaHeaderProps {
  logoUrl?: string;
}

export function DucaHeader({ logoUrl }: DucaHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Breadcrumb arriba */}
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", url: "/dashboard", onClick: (url) => navigate(url) },
            { label: "Managua", url: "/access-control", onClick: (url) => navigate(url) },
            { label: "Registro de Mercancía", url: "/merchandise-registration", onClick: (url) => navigate(url) },
          ]}
        />
      </div>

      {/* Contenedor principal para el texto a la izquierda y logo a la derecha */}
      <div className="flex justify-between items-center">
        {/* Bloque de texto a la izquierda */}
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0! text-xl font-bold">Registro de Documentacion</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Gestión y vinculación de DUCA por orden de servicio
          </small>
        </div>

        {/* Logo a la derecha */}
        {logoUrl && (
          <div className="flex items-center">
            <img src={logoUrl} alt="Logo Corporativo" className="h-15 object-contain" />
          </div>
        )}
      </div>
    </div>
  );
}