import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getRacksColumns } from "./racks-columns";
import type { RacksTableProps } from "./types/racks-table.types";

export function RacksTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  height,
  minHeight,
  maxHeight,
  onPageChange,
  onSelectRow,
  onViewPositions,
  onUpdateRack,
  onDeleteRack,
  isFetching = false,
}: RacksTableProps) {
  const lastItem = data.at(-1);
  const lastItemId = lastItem?.rack_id;

  const columns = useMemo(
    () =>
      getRacksColumns({
        onViewPositions,
        onUpdateRack,
        onDeleteRack,
        lastItemId,
      }),
    [onViewPositions, onUpdateRack, onDeleteRack, lastItemId],
  );

  return (
    <DataTable
      title="Lista de racks"
      data={data}
      columns={columns}
      onRowClick={onSelectRow}
      height={height}
      minHeight={minHeight}
      maxHeight={maxHeight}
      pagination={
        <Pagination
          currentPage={currentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={onPageChange}
          disabled={isFetching || totalRecords === 0}
        />
      }
    />
  );
}
