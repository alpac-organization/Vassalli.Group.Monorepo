import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { Modal } from "@alpac/design-system";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";
import type {ImageUploaderProps,ImageOutput} from "./image-uploader.types";

const DEFAULT_MAX_SIZE_MB = 50;

function generateId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

async function processFiles(
  files: File[],
  existing: ImageOutput[],
  maxFiles?: number,
): Promise<ImageOutput[]> {
  const newImages = await Promise.all(
    files.map(async (file) => {
      const result = await fileToBase64(file);
      const base64String =
        typeof result === "string" ? result : result.image_base64;
      const actualContentType = 
        typeof result === "string" ? file.type : result.content_type;
      return {
        id: generateId(),
        file,
        base64: base64String,
        preview: URL.createObjectURL(file),
        contentType: actualContentType,
      };
    }),
  );
  const merged = [...existing, ...newImages];
  if (maxFiles && merged.length > maxFiles) {
    const kept = merged.slice(0, maxFiles);
    const discarded = merged.slice(maxFiles);
    // Liberar memoria de las vistas previas descartadas
    discarded.forEach((item) => URL.revokeObjectURL(item.preview));
    return kept;
  }
  return merged;
}

export function ImageUploader({
  value = [],
  onChange,
  label,
  title,
  description,
  maxFiles,
  minFiles,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  error,
  isRequired = false,
  capture,
}: ImageUploaderProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const nativeInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      setDropError(null);
      if (!files.length) return;

      const maxBytes = maxSizeMB * 1024 * 1024;
      const tooBig = files.find((f) => f.size > maxBytes);
      if (tooBig) {
        setDropError(`Cada imagen debe pesar menos de ${maxSizeMB} MB.`);
        return;
      }
      const result = await processFiles(files, valueRef.current, maxFiles);
      onChange(result);
    },
    [onChange, maxFiles, maxSizeMB],
  );

  const handleNativeInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      await handleFiles(files);
      e.target.value = "";
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      const removed = valueRef.current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      const next = valueRef.current.filter((item) => item.id !== id);
      onChange(next);
    },
    [onChange],
  );

  const remainingSlots = maxFiles ? maxFiles - value.length : 999;
  const canAdd = remainingSlots > 0;

  const { getRootProps } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [] },
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: !canAdd,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0]?.errors[0]?.code;
        if (code === "file-too-large")
          setDropError(`Cada imagen debe pesar menos de ${maxSizeMB} MB.`);
        else setDropError("No se pudo adjuntar la imagen.");
        return;
      }
      await handleFiles(acceptedFiles);
    },
  });

  const displayError = error ?? dropError ?? null;

  return (
    <div {...getRootProps()} className="flex flex-col gap-2">
      {(label || title) && (
        <span className="text-sm font-medium text-black dark:text-white">
          {label ?? title}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
          {maxFiles && (
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              ({minFiles && `${minFiles} a `}{maxFiles} imágenes)
            </span>
          )}
        </span>
      )}

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-3 gap-3">
        {value.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-md border border-slate-200 dark:border-slate-600 group cursor-pointer"
            onClick={() => setPreviewOpen(item.preview)}
          >
            <img
              src={item.preview}
              alt="Adjunto"
              className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item.id);
              }}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
              aria-label="Eliminar imagen"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {canAdd && (
          <div
            onClick={() => nativeInputRef.current?.click()}
            className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-2 text-center transition-colors border-slate-300 hover:border-alpac-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50`}
          >
            <ImagePlus
              size={20}
              className="text-slate-500 dark:text-slate-400"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Agregar imagen
            </span>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}

      <input
        ref={nativeInputRef}
        type="file"
        accept="image/*"
        capture={capture}
        onChange={handleNativeInputChange}
        className="hidden"
        aria-label="Seleccionar imágenes"
      />

      <Modal
        isOpen={Boolean(previewOpen)}
        onClose={() => setPreviewOpen(null)}
        title="Vista previa de evidencia"
        size="3xl"
      >
        <div className="flex h-full max-h-[80vh] w-full items-center justify-center p-2 bg-slate-100 dark:bg-black/50 rounded-md">
          {previewOpen && (
            <img
              src={previewOpen}
              alt="Vista previa ampliada"
              className="max-h-full max-w-full object-contain drop-shadow-lg"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
