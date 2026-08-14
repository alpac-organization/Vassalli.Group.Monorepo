import { Button, DataTable, Pagination, type TableColumn, InputText, Dropdown, Badges } from "@alpac/design-system";
import { Plus, Warehouse } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WarehouseModal } from "@app/modules/warehouse/ui/warehouse/components/warehouse-modal/warehouse-modal";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

type WarehouseRow = {
  warehouse_id: string;
  warehouse_name: string;
  warehouse_code: string;
  warehouse_type: string;
  is_active: boolean;
};

export const ManageSectionPage = () => {
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const { companyId, moduleCode } = useUserStore();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const warehouseData = useMemo<WarehouseRow[]>(() => {
    const payload = GetWarehouses.data;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    return list
      .map((item: any) => ({
        warehouse_id: item.warehouse_id ?? "",
        warehouse_name: item.warehouse_name ?? "-",
        warehouse_code: item.warehouse_code ?? "-",
        warehouse_type: item.warehouse_type ?? "-",
        is_active: Boolean(item.is_active),
      }))
      .filter((item) => {
        // Search Filter
        const matchesSearch =
          searchTerm === "" ||
          item.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.warehouse_code.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Type Filter
        const matchesType = filterType === "" || item.warehouse_type === filterType;

        // Status Filter
        let matchesStatus = true;
        if (filterStatus === "Activa") {
          matchesStatus = item.is_active === true;
        } else if (filterStatus === "Inactiva") {
          matchesStatus = item.is_active === false;
        }

        return matchesSearch && matchesType && matchesStatus;
      });
  }, [GetWarehouses.data, searchTerm, filterType, filterStatus]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return warehouseData.slice(start, start + pageSize);
  }, [warehouseData, currentPage, pageSize]);

  const columns: TableColumn<WarehouseRow>[] = [
    { key: "warehouse_name", label: "Nombre" },
    { key: "warehouse_code", label: "Código" },
    { key: "warehouse_type", label: "Tipo" },
    {
      key: "is_active",
      label: "Estado",
      render(row) {
        return row.is_active ? (
          <Badges
            label="Activa"
            color="success"
            className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
          />
        ) : (
          <Badges
            label="Inactiva"
            color="gray"
            className="bg-slate-800! border! border-slate-700! text-slate-400!"
          />
        );
      },
    },
    {
      key: "action",
      label: "Acciones",
      render(row) {
        return (
          <Button
            type="button"
            size="medium"
            label="Ver secciones"
            onClick={() =>
              navigate(`${baseUrl}/warehouse-admin/management/sections/${row.warehouse_id}`)
            }
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-6 bg-[#14161c] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        {/* Header Section (Title and count) */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Lista de bodegas</h1>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
            {warehouseData.length} registros
          </span>
        </div>

        <Button
          type="button"
          size="giant"
          label="Registrar Nueva Bodega"
          icon={<Warehouse size={20} />}
          className="w-full! md:w-auto! mt-4! sm:mt-0! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          onClick={() => setIsWarehouseModalOpen(true)}
        />
      </div>

      {/* Filters Section */}
      <div className="bg-[#1b1e27] border border-[#2a2d3d] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <InputText
            placeholder="Buscar por nombre o código..."
            className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500! placeholder-slate-500!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-56">
          <Dropdown
            placeholder="Todos los tipos"
            appearance="dark"
            className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
            value={filterType}
            onChange={(val) => setFilterType(val)}
            options={[
              { value: "", label: "Todos los tipos" },
              { value: "Fiscal", label: "Fiscal" },
              { value: "General", label: "General" },
              { value: "Granel", label: "Granel" },
            ]}
          />
        </div>

        <div className="w-full md:w-56">
          <Dropdown
            placeholder="Todos los estados"
            appearance="dark"
            className="w-full! bg-[#14161c]! border! border-[#2a2d3d]! text-slate-200! rounded-lg! focus:ring-indigo-500! focus:border-indigo-500!"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={[
              { value: "", label: "Todos los estados" },
              { value: "Activa", label: "Activa" },
              { value: "Inactiva", label: "Inactiva" },
            ]}
          />
        </div>
      </div>

      <DataTable
        title="Lista de bodegas"
        data={paginatedData}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={warehouseData.length}
            onPageChange={(page) => setCurrentPage(page)}
            disabled={warehouseData.length === 0}
          />
        }
      />

      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onSubmit={(data: any) => {
          GetWarehouses.refetch();
        }}
        onClose={() => setIsWarehouseModalOpen(false)}
      />
    </div>
  );
};
