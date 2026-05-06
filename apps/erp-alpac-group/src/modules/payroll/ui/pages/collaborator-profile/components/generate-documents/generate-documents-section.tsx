import { useEffect, useState } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  RadioButton,
  Spinner,
} from "@alpac/design-system";
import { AlertTriangle, FileText } from "lucide-react";
import type { GeneratedDocumentType } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import type { GenerateDocumentsSectionProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/generate-documents/types/generate-document.type";
import type { FeedbackAlert } from "@app/modules/payroll/ui/pages/collaborator-profile/components/generate-documents/utils/generate-doc-utils";
import {
  DOCUMENT_OPTIONS,
  getDocumentGenerationErrorMessage,
} from "@app/modules/payroll/ui/pages/collaborator-profile/components/generate-documents/utils/generate-doc-utils";

export function GenerateDocumentsSection({
  onGenerateDocument,
  isGenerating,
  isSuccess,
  isError,
  error,
}: GenerateDocumentsSectionProps) {
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<GeneratedDocumentType>(
      DOCUMENT_OPTIONS[0]?.value ?? "LetterCollaboratorActive",
    );
  const [feedbackAlert, setFeedbackAlert] = useState<FeedbackAlert | null>(
    null,
  );
  useEffect(() => {
    if (!feedbackAlert) return;
    const timer = setTimeout(() => {
      setFeedbackAlert(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [feedbackAlert]);
  useEffect(() => {
    if (isGenerating) {
      setFeedbackAlert(null);
      return;
    }

    if (isError) {
      setFeedbackAlert({
        type: "error",
        title: "No se pudo generar el documento",
        message: getDocumentGenerationErrorMessage(error),
      });
      return;
    }

    if (isSuccess) {
      setFeedbackAlert({
        type: "success",
        title: "Documento generado",
        message:
          "El documento se generó y se descargó correctamente en su equipo.",
      });
    }
  }, [error, isError, isGenerating, isSuccess]);

  const handleGenerate = () => {
    onGenerateDocument(selectedDocumentType);
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-5">
      <AnimatedAlertWrapper open={!!feedbackAlert}>
        {feedbackAlert ? (
          <Alert
            type={feedbackAlert.type}
            title={feedbackAlert.title}
            message={feedbackAlert.message}
            showCloseButton
            onClose={() => setFeedbackAlert(null)}
          />
        ) : null}
      </AnimatedAlertWrapper>

      <section className="w-full overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#272b34]">
        <div className="m-8 mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-md bg-[#2b2f38] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full overflow-hidden rounded-md border-l-4 border-red-400/95 bg-[#272b34] p-4 shadow-sm lg:max-w-4xl">
            <div className="flex items-center gap-4 text-left">
              <AlertTriangle
                className="h-5 w-5 shrink-0 text-red-400/95"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-slate-200">
                La generacion de documentos deben estar validadas y firmadas por
                administracion, por lo tanto debe de tenerlo en cuenta.
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            <div className="pl-4">
              <h4 className="text-2xl font-bold text-white sm:text-3xl">
                Tipo de documento
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                Selecciona el documento que deseas generar.
              </p>
            </div>

            <fieldset
              className="flex flex-col gap-4"
              aria-label="Tipos de documento"
            >
              {DOCUMENT_OPTIONS.map((option) => {
                const isSelected = selectedDocumentType === option.value;
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    onClick={() => setSelectedDocumentType(option.value)}
                    className={[
                      "flex w-full cursor-pointer items-center rounded-lg border p-4 transition-all sm:p-5",
                      isSelected
                        ? "border-green-500 bg-[#323640] shadow-sm"
                        : "border-slate-600 bg-[#272b34] hover:border-slate-500",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "mr-4 shrink-0 transition-colors",
                        isSelected ? "text-green-500" : "text-slate-400",
                      ].join(" ")}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>

                    <RadioButton
                      id={`generated-document-${option.value}`}
                      name="generated-document-type"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setSelectedDocumentType(option.value)}
                      labelPosition="left"
                      className="w-full justify-between"
                      labelClassName="text-sm font-medium text-slate-100 sm:text-base text-left"
                      label={option.label}
                    />
                  </div>
                );
              })}
            </fieldset>
          </div>

          {/* Botón con la flecha agregada */}
          <div className="mx-auto flex w-full max-w-4xl justify-end mt-2">
            <Button
              type="button"
              size="medium"
              onClick={handleGenerate}
              disabled={isGenerating}
              label={
                isGenerating ? "Generando documento..." : "Generar documento →"
              }
              icon={
                isGenerating ? (
                  <Spinner size="small" color="white" />
                ) : (
                  <FileText size={18} />
                )
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
