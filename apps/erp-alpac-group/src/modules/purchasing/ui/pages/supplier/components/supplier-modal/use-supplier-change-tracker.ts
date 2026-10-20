import { useCallback, useLayoutEffect, useRef } from "react";
import type {
  UpdateSupplierDetailsPayload,
  UpdateSupplierRequest,
} from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";

/* este Hook  permite trackear los cambios realizados en los campos del formulario de proveedor,
 * almacenando sólo los campos que han sido modificados respecto al estado inicial (diff).
 * Ideal para optimizar el envío de updates solo con campos cambiados en modo edición, en lugar de escuchar al evento de los inputs.
 */
export function useSupplierChangeTracker(
  trackerInitial: UpdateSupplierRequest,
  isEditMode: boolean,
) {
  const diffRef = useRef<Partial<UpdateSupplierRequest>>({});
  const initialRef = useRef(trackerInitial);
  const isEditModeRef = useRef(isEditMode);

  useLayoutEffect(() => {
    initialRef.current = trackerInitial;
    isEditModeRef.current = isEditMode;
  }, [trackerInitial, isEditMode]);

  const updateField = useCallback(
    <K extends keyof UpdateSupplierRequest>(
      field: K,
      value: UpdateSupplierRequest[K],
    ) => {
      const initialData = initialRef.current;
      if (initialData[field] === value) {
        if (!(field in diffRef.current)) return;
        const next = { ...diffRef.current };
        delete next[field];
        diffRef.current = next;
        return;
      }

      if (diffRef.current[field] === value) return;
      diffRef.current = { ...diffRef.current, [field]: value };
    },
    [],
  );

  const trackField = useCallback(
    <K extends keyof UpdateSupplierRequest>(
      field: K,
      value: UpdateSupplierRequest[K],
    ) => {
      if (!isEditModeRef.current) return;
      updateField(field, value);
    },
    [updateField],
  );

  const trackDetailField = useCallback(
    <K extends keyof UpdateSupplierDetailsPayload>(
      field: K,
      value: UpdateSupplierDetailsPayload[K],
    ) => {
      if (!isEditModeRef.current) return;

      const initial = initialRef.current;
      const initialValue = initial.supplier_details?.[field];
      const current: UpdateSupplierDetailsPayload = {
        ...(diffRef.current.supplier_details ?? {}),
      };

      if (initialValue === value) {
        delete current[field];
      } else {
        current[field] = value;
      }

      updateField(
        "supplier_details",
        Object.keys(current).length === 0
          ? initial.supplier_details
          : current,
      );
    },
    [updateField],
  );

  // aqui tiene como funcion  recibir un objeto con múltiples cambios para los campos de 'supplier_details'
  // y actualiza el estado de los cambios trackeados, omitiendo los que no han cambiado respecto al valor inicial de esto.
  const trackMultipleDetailFields = useCallback(
    (changes: UpdateSupplierDetailsPayload) => {
      if (!isEditModeRef.current) return;

      const initial = initialRef.current;
      const initialDetails = initial.supplier_details ?? {};
      const current: UpdateSupplierDetailsPayload = {
        ...(diffRef.current.supplier_details ?? {}),
      };

      (Object.keys(changes) as (keyof UpdateSupplierDetailsPayload)[]).forEach(
        (key) => {
          const val = changes[key];
          if (initialDetails[key] === val) {
            delete current[key];
          } else {
            current[key] = val as never;
          }
        },
      );

      updateField(
        "supplier_details",
        Object.keys(current).length === 0
          ? initial.supplier_details
          : current,
      );
    },
    [updateField],
  );

  const reset = useCallback(() => {
    diffRef.current = {};
  }, []);

  const read = useCallback(() => diffRef.current, []);

  return {
    trackField,
    trackDetailField,
    trackMultipleDetailFields,
    reset,
    read,
  };
}
