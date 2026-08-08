import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Badges,
  Button,
  Dropdown,
  InputText,
  Modal,
  Tabs,
  type Option,
  type TabItem,
} from "@alpac/design-system";
import { Check, Loader2, Pencil, MessageCircleX, X, Plus } from "lucide-react";
import { EditableField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/editable-field/editable-field";
import {
  MOVEMENT_DETAIL_DEFAULT_VALUES,
  type MovementDetailFormValues,
  type MovementDetailModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import { ConsolidatedVariations } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import { Loader } from "@app/shared/components/loaders/loader";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/field-missing";
import {
  editableFieldInputClasses,
  baseInputClasses,
  sectionTitleClasses,
  fieldsGridClasses,
  mobileOnlyScrollClasses,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import {
  isDucaDocumentType,
  mapDetailToFormValues,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/mapMovementDetail";

export function MovementDetailModal({
  isOpen,
  detail,
  isLoading = false,
  onClose,
  onFieldUpdate,
  onDucatUpdate,
  onDucatAdd,
}: MovementDetailModalProps) {
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedDucatId, setSelectedDucatId] = useState("");
  const [isEditingDucat, setIsEditingDucat] = useState(false);
  const [ducatDraft, setDucatDraft] = useState("");
  const [isSavingDucat, setIsSavingDucat] = useState(false);

  const [isAddingDucat, setIsAddingDucat] = useState(false);
  const [newDucatDraft, setNewDucatDraft] = useState("");
  const [isSavingNewDucat, setIsSavingNewDucat] = useState(false);

  const formValues = useMemo(
    () =>
      detail ? mapDetailToFormValues(detail) : MOVEMENT_DETAIL_DEFAULT_VALUES,
    [detail],
  );

  const formMethods = useForm<MovementDetailFormValues>({
    mode: "onChange",
    defaultValues: MOVEMENT_DETAIL_DEFAULT_VALUES,
    values: formValues,
    resetOptions: { keepDirty: true },
  });

  const ducatOptions = useMemo<Option[]>(
    () =>
      (detail?.ducats ?? []).map((ducat) => ({
        value: ducat.id,
        label: ducat.ducat_number,
      })),
    [detail?.ducats],
  );

  const ducatsMissing = ducatOptions.length === 0;
  const selectedDucatLabel =
    ducatOptions.find((option) => String(option.value) === selectedDucatId)
      ?.label ?? "";
  const showCustomsDeclaration = detail ? !isDucaDocumentType(detail) : false;

  useEffect(() => {
    if (!isOpen) {
      setEditingFields({});
      setSelectedDucatId("");
      setIsEditingDucat(false);
      setDucatDraft("");
      setIsSavingDucat(false);
      setIsAddingDucat(false);
      setNewDucatDraft("");
      setIsSavingNewDucat(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDucatId && ducatOptions[0]?.value != null) {
      setSelectedDucatId(String(ducatOptions[0].value));
    }
  }, [ducatOptions, selectedDucatId]);

  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const startDucatEdit = (option: Option) => {
    setSelectedDucatId(String(option.value));
    setDucatDraft(option.label);
    setIsEditingDucat(true);
  };

  const cancelDucatEdit = () => {
    setDucatDraft(selectedDucatLabel);
    setIsEditingDucat(false);
  };

  const confirmDucatEdit = async () => {
    const nextValue = ducatDraft.trim();
    if (!selectedDucatId || !nextValue) return;

    setIsSavingDucat(true);
    try {
      await onDucatUpdate(selectedDucatId, nextValue);
      setIsEditingDucat(false);
    } finally {
      setIsSavingDucat(false);
    }
  };

  const startDucatAdd = () => {
    setNewDucatDraft("");
    setIsAddingDucat(true);
  };

  const cancelDucatAdd = () => {
    setNewDucatDraft("");
    setIsAddingDucat(false);
  };

  const confirmDucatAdd = async () => {
    const nextValue = newDucatDraft.trim();
    if (!nextValue || !onDucatAdd) return;

    setIsSavingNewDucat(true);
    try {
      await onDucatAdd([nextValue]);
      setIsAddingDucat(false);
      setNewDucatDraft("");
    } finally {
      setIsSavingNewDucat(false);
    }
  };

  const tabItems: TabItem<string>[] = [
    {
      id: "resumen",
      label: "Resumen de ingreso",
      render: () => (
        <div className="min-w-0 pt-1 sm:pt-2">
          <div className={fieldsGridClasses}>
            <EditableField
              name="document_type"
              label="Tipo de documento"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              missingMessage="Tipo de documento no registrado"
              className={editableFieldInputClasses}
            />
            {!showCustomsDeclaration && (
              <div className="min-w-0">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 relative">
                    <Dropdown
                      appearance="dark"
                      label="DUCAs del registro"
                      optional
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      placeholder={
                        ducatsMissing
                          ? "DUCAs no registradas"
                          : "Seleccione una DUCA"
                      }
                      options={ducatOptions}
                      value={
                        ducatsMissing ? undefined : selectedDucatId || undefined
                      }
                      onChange={(value) => {
                        setSelectedDucatId(String(value));
                        setIsEditingDucat(false);
                        const option = ducatOptions.find(
                          (item) => String(item.value) === String(value),
                        );
                        setDucatDraft(option?.label ?? "");
                      }}
                      onEditOption={(option) => startDucatEdit(option)}
                      className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                      valueClassName={
                        ducatsMissing
                          ? missingDataInInputClassName
                          : "text-white! dark:text-white!"
                      }
                    />
                  </div>
                  {!isAddingDucat && (
                    <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                      <Button
                        type="button"
                        ariaLabel="Agregar DUCA"
                        onClick={startDucatAdd}
                        icon={<Plus size={16} />}
                        className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-slate-200! dark:border-slate-700/50! bg-white! dark:bg-[#1e2229]! text-slate-500! dark:text-slate-400! hover:text-blue-600! dark:hover:text-white! hover:border-cyan-300! dark:hover:border-blue-600! hover:bg-cyan-50! dark:hover:bg-cyan-500/10! transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isAddingDucat && (
              <div className="min-w-0">
                <div className="flex min-w-0 items-start gap-2">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Nueva DUCA"
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled={isSavingNewDucat}
                      value={newDucatDraft}
                      onChange={(event) => setNewDucatDraft(event.target.value)}
                      className={`${baseInputClasses} text-slate-800 dark:text-white!`}
                      placeholder="Ingrese Nº Duca"
                    />
                  </div>
                  <div className="flex shrink-0 gap-1.5 sm:gap-2 mt-[24px] sm:mt-[26px]">
                    <Button
                      type="button"
                      ariaLabel="Cancelar agregar DUCA"
                      disabled={isSavingNewDucat}
                      onClick={cancelDucatAdd}
                      icon={<MessageCircleX size={16} />}
                      className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-red-200! dark:border-red-500/30! bg-red-50! dark:bg-red-500/10! text-red-600! dark:text-red-400! hover:bg-red-100! dark:hover:bg-red-500/20! hover:border-red-300! transition-all duration-200 disabled:opacity-40!"
                    />
                    <Button
                      type="button"
                      ariaLabel="Confirmar agregar DUCA"
                      disabled={isSavingNewDucat || !newDucatDraft.trim()}
                      onClick={confirmDucatAdd}
                      icon={
                        isSavingNewDucat ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )
                      }
                      className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-emerald-200! dark:border-emerald-500/30! bg-emerald-50! dark:bg-emerald-500/10! text-emerald-600! dark:text-emerald-400! hover:bg-emerald-100! disabled:opacity-40! transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {!ducatsMissing && selectedDucatId ? (
              <div className="min-w-0">
                <div className="flex min-w-0 items-start gap-2">
                  <div className="min-w-0 flex-1 relative">
                    <InputText
                      label="Número DUCA"
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      disabled={!isEditingDucat || isSavingDucat}
                      editable={false}
                      value={
                        isEditingDucat
                          ? ducatDraft
                          : isValueMissing(selectedDucatLabel)
                            ? "DUCA no registrada"
                            : selectedDucatLabel
                      }
                      onChange={(event) => setDucatDraft(event.target.value)}
                      className={`${baseInputClasses} ${
                        !isEditingDucat && isValueMissing(selectedDucatLabel)
                          ? missingDataInInputClassName
                          : "text-slate-800 dark:text-white!"
                      }`}
                    />
                  </div>
                  <div className="flex shrink-0 gap-1.5 sm:gap-2 mt-[24px] sm:mt-[26px]">
                    {!isEditingDucat ? (
                      <Button
                        type="button"
                        ariaLabel="Editar DUCA"
                        onClick={() => {
                          const option = ducatOptions.find(
                            (item) => String(item.value) === selectedDucatId,
                          );
                          if (option) startDucatEdit(option);
                        }}
                        icon={<Pencil size={16} />}
                        className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-slate-200! dark:border-slate-700/50! bg-white! dark:bg-[#1e2229]! text-slate-500! dark:text-slate-400! hover:text-blue-600! dark:hover:text-white! hover:border-cyan-300! dark:hover:border-blue-600! hover:bg-cyan-50! dark:hover:bg-cyan-500/10! transition-all duration-200"
                      />
                    ) : (
                      <>
                        <Button
                          type="button"
                          ariaLabel="Cancelar edición de DUCA"
                          disabled={isSavingDucat}
                          onClick={cancelDucatEdit}
                          icon={<MessageCircleX size={16} />}
                          className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-red-200! dark:border-red-500/30! bg-red-50! dark:bg-red-500/10! text-red-600! dark:text-red-400! hover:bg-red-100! dark:hover:bg-red-500/20! hover:border-red-300! transition-all duration-200 disabled:opacity-40!"
                        />
                        <Button
                          type="button"
                          ariaLabel="Confirmar edición de DUCA"
                          disabled={isSavingDucat || !ducatDraft.trim()}
                          onClick={confirmDucatEdit}
                          icon={
                            isSavingDucat ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )
                          }
                          className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-emerald-200! dark:border-emerald-500/30! bg-emerald-50! dark:bg-emerald-500/10! text-emerald-600! dark:text-emerald-400! hover:bg-emerald-100! disabled:opacity-40! transition-all duration-200"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <EditableField
              name="country_of_origin"
              label="País de origen"
              formMethods={formMethods}
              isEditing={Boolean(editingFields.country_of_origin)}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              missingMessage="País no registrado"
              className={editableFieldInputClasses}
            />
            <EditableField
              name="start_date"
              label="Fecha de registro"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              missingMessage="Fecha no registrada"
              className={editableFieldInputClasses}
            />
            <EditableField
              name="start_time"
              label="Hora inicial registro"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              missingMessage="Hora inicial no registrada"
              className={editableFieldInputClasses}
            />
            <EditableField
              name="end_time"
              label="Hora final registro"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              allowEmptySubmit
              missingMessage="Hora final no registrada"
              className={editableFieldInputClasses}
            />
            <EditableField
              name="duration_formatted"
              label="Duración"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              allowEmptySubmit
              missingMessage="Duración no registrada"
              className={editableFieldInputClasses}
            />
            <EditableField
              name="processed_by_user_name"
              label="Procesado por"
              formMethods={formMethods}
              isEditing={false}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={onFieldUpdate}
              allowEdit={false}
              allowEmptySubmit
              missingMessage="Responsable no registrado"
              className={editableFieldInputClasses}
            />
          </div>

          {showCustomsDeclaration ? (
            <div className="min-w-0 border-t border-slate-200 dark:border-neutral-600 mt-6 sm:mt-8 pt-6 sm:pt-8">
              <h4 className={sectionTitleClasses}>Declaración aduanera</h4>
              <div className={fieldsGridClasses}>
                <EditableField
                  name="customs_decaration_number"
                  label="Número de declaración"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.customs_decaration_number)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={onFieldUpdate}
                  allowEmptySubmit
                  missingMessage="Declaración no registrada"
                  className={editableFieldInputClasses}
                />
                <EditableField
                  name="packages"
                  label="Paquetes"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.packages)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={onFieldUpdate}
                  allowEmptySubmit
                  missingMessage="Bultos no registrados"
                  className={editableFieldInputClasses}
                />
                <EditableField
                  name="customer"
                  label="Cliente"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.customer)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={onFieldUpdate}
                  allowEmptySubmit
                  missingMessage="Cliente no registrado"
                  className={editableFieldInputClasses}
                />
                <EditableField
                  name="product"
                  label="Producto"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.product)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={onFieldUpdate}
                  allowEmptySubmit
                  missingMessage="Producto no registrado"
                  className={editableFieldInputClasses}
                />
                <EditableField
                  name="container_number"
                  label="Número de contenedor"
                  formMethods={formMethods}
                  isEditing={Boolean(editingFields.container_number)}
                  onEditStart={handleEditStart}
                  onEditEnd={handleEditEnd}
                  onConfirmUpdate={onFieldUpdate}
                  allowEmptySubmit
                  missingMessage="Contenedor no registrado"
                  className={editableFieldInputClasses}
                />
              </div>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "vehiculo",
      label: "Datos del vehículo y conductor",
      render: () => (
        <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
          <EditableField
            name="plate_number"
            label="Numero de Placa"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.plate_number)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Placa no registrada"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="trailer_chassis"
            label="Chasis de Remolque"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.trailer_chassis)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Chasis no registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="driver_name"
            label="Conductor"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.driver_name)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Conductor no registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="driver_license"
            label="Licencia de conductor"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.driver_license)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Licencia no registrada"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="transportista"
            label="Transportista"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.transportista)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Transportista no registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="transport_unit_name"
            label="Unidad de transporte"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="Unidad no registrada"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="seal_number"
            label="Número de sello"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.seal_number)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Marchamo no registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="aduana"
            label="Aduana"
            formMethods={formMethods}
            isEditing={Boolean(editingFields.aduana)}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            missingMessage="Aduana no registrada"
            className={editableFieldInputClasses}
          />
        </div>
      ),
    },
    {
      id: "salida",
      label: "Actualización y salida",
      render: () => (
        <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
          <EditableField
            name="updated_by_user_name"
            label="Actualizado por"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="No registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="updated_date"
            label="Fecha de actualización"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="No registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="updated_time"
            label="Hora de actualización"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="No registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="transport_unit_exit_date"
            label="Fecha de salida"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="No registrado"
            className={editableFieldInputClasses}
          />
          <EditableField
            name="transport_unit_exit_time"
            label="Hora de salida"
            formMethods={formMethods}
            isEditing={false}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
            onConfirmUpdate={onFieldUpdate}
            allowEdit={false}
            allowEmptySubmit
            missingMessage="No registrado"
            className={editableFieldInputClasses}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del movimiento"
      variant="info"
      size="5xl"
      panelClassName="max-md:max-h-[min(92dvh,56rem)]! md:max-h-none! flex! flex-col! max-md:overflow-hidden! md:overflow-visible! p-4! sm:p-6!"
    >
      {isLoading || !detail ? (
        <div className="min-h-40 flex items-center justify-center py-8">
          <Loader title="Cargando detalle..." />
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 gap-4 max-md:overflow-hidden md:overflow-visible">
          <div className={`flex-1 min-h-0 ${mobileOnlyScrollClasses}`}>
            <div className="w-full max-w-full">
              <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm rounded-xl">
                <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
                  <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-end">
                    <Badges
                      label={
                        detail.is_consolidated
                          ? ConsolidatedVariations.consolidated.label
                          : ConsolidatedVariations.Unbound.label
                      }
                      color="transparent"
                      className={
                        detail.is_consolidated
                          ? ConsolidatedVariations.consolidated.color
                          : ConsolidatedVariations.Unbound.color
                      }
                    />
                  </div>

                  <Tabs
                    key={detail.id}
                    activeTab="resumen"
                    tabItems={tabItems}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="shrink-0 flex justify-end pt-3 border-t border-slate-200 dark:border-neutral-600">
            <Button
              type="button"
              size="medium"
              label="Cerrar"
              icon={<X size={16} />}
              ariaLabel="Cerrar detalle"
              onClick={onClose}
              className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
