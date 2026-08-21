import { useState, useEffect, useRef } from "react";
import { Check, ImagePlus, Loader2, Pencil, X } from "lucide-react";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";

export type EvidenceManagerProps = {
  initialEvidences: string[];
  onSave?: (toAdd: string[], toDelete: string[]) => Promise<void>;
  onPreviewImage: (url: string) => void;
};

export const EvidenceManager = ({
  initialEvidences,
  onSave,
  onPreviewImage,
}: EvidenceManagerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftEvidence, setDraftEvidence] = useState<ImageOutput[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraftEvidence([]);
    }
  }, [isEditing]);

  const startEdit = () => {
    setDraftEvidence(
      initialEvidences.map((url, i) => ({
        id: `existing-${i}`,
        file: null as any,
        base64: "",
        preview: url,
        contentType: "image/jpeg",
      }))
    );
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleRemove = (id: string) => {
    setDraftEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remainingSlots = 5 - draftEvidence.length;
    const filesToProcess = files.slice(0, remainingSlots);

    const newItems: ImageOutput[] = await Promise.all(
      filesToProcess.map(async (file) => {
        const result = await fileToBase64(file);
        const base64String =
          typeof result === "string" ? result : result.image_base64;
        const actualContentType =
          typeof result === "string" ? file.type : result.content_type;
        return {
          id: typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).substring(2),
          file,
          base64: base64String,
          preview: URL.createObjectURL(file),
          contentType: actualContentType,
        };
      })
    );

    setDraftEvidence((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const confirmEdit = async () => {
    if (!onSave) return;
    setIsSaving(true);

    try {
      const existingUrlsAfterEdit = draftEvidence
        .filter((e) => e.preview && !e.base64)
        .map((e) => e.preview!);

      const toDelete = initialEvidences.filter(
        (url) => !existingUrlsAfterEdit.includes(url)
      );

      const toAdd = draftEvidence
        .filter((e) => e.base64)
        .map((e) =>
          e.base64.startsWith("data:")
            ? e.base64
            : `data:${e.file?.type || "image/jpeg"};base64,${e.base64}`
        );

      await onSave(toAdd, toDelete);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 sm:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] sm:text-[14px] font-medium text-slate-500 dark:text-gray-400">
          Evidencias
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {isEditing ? (
        <div className="flex flex-row flex-wrap gap-3 items-center">
          {draftEvidence.map((item) => (
            <div
              key={item.id}
              className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden group cursor-pointer shrink-0"
              onClick={() => onPreviewImage(item.preview)}
            >
              <img
                src={item.preview}
                alt="Evidencia"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-red-600 transition-colors"
                title="Eliminar foto"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {draftEvidence.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-16 w-16 sm:h-20 sm:w-20 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-500/10 text-slate-500 dark:text-slate-400 transition-all shrink-0 cursor-pointer"
              title="Agregar imagen"
            >
              <ImagePlus size={18} />
              <span className="text-[10px] font-medium leading-none">Agregar</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-1 shrink-0">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
              title="Cancelar"
              className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex items-center justify-center rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-300 transition-all duration-200"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={confirmEdit}
              disabled={isSaving}
              title="Guardar"
              className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex items-center justify-center rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 disabled:opacity-40 transition-all duration-200"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-3 items-center">
          {initialEvidences && initialEvidences.length > 0 ? (
            <>
              {initialEvidences.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Evidencia ${i + 1}`}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md cursor-pointer border border-slate-300 dark:border-slate-600 hover:opacity-80 transition-opacity"
                  onClick={() => onPreviewImage(url)}
                />
              ))}
              <div className="flex items-center justify-center h-16 sm:h-20 ml-1">
                <button
                  type="button"
                  aria-label="Editar evidencia"
                  onClick={startEdit}
                  className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm italic text-amber-600 dark:text-amber-500">
                Imágenes no registradas
              </span>
              <button
                type="button"
                aria-label="Añadir evidencia"
                onClick={startEdit}
                className="h-[42px] w-[42px] sm:h-[46px] sm:w-[46px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-[#1e2229] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-cyan-300 dark:hover:border-blue-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-200"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
