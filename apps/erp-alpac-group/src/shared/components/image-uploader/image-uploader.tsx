import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X, Upload } from "lucide-react";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";
import type {ImageUploaderProps,ImageOutput} from "./image-uploader.types";

const DEFAULT_MAX_SIZE_MB = 50;

function generateId(): string {
  // Safe for both HTTPS and HTTP (LAN) contexts
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
      return {
        id: generateId(),
        file,
        base64: base64String,
        preview: URL.createObjectURL(file),
      };
    }),
  );
  const merged = [...existing, ...newImages];
  return maxFiles ? merged.slice(0, maxFiles) : merged;
}

export function ImageUploader({
  value = [],
  onChange,
  label,
  title,
  description,
  maxFiles,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  error,
  isRequired = false,
  capture,
}: ImageUploaderProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const nativeInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    return () => {
      valueRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

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

  const handleNativeChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      await handleFiles(files);
      e.target.value = "";
    },
    [handleFiles],
  );

  const removeImage = useCallback(
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

  const { getRootProps, isDragActive } = useDropzone({
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
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
          {maxFiles != null && maxFiles > 1 && (
            <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              (Máximo {maxFiles})
            </span>
          )}
        </span>
      )}
      <input
        ref={nativeInputRef}
        type="file"
        accept="image/*"
        multiple={!maxFiles || maxFiles > 1}
        capture={capture}
        className="sr-only"
        onChange={handleNativeChange}
        aria-label="Seleccionar imágenes"
      />

      <div
        {...getRootProps()}
        className={`relative flex flex-col min-h-32 rounded-md border-2 border-dashed p-4 transition-all duration-200 ${
          isDragActive
            ? "border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
            : "border-slate-300 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-800/30"
        }`}
      >
        {value.length === 0 ? (
          <button
            type="button"
            onClick={() => nativeInputRef.current?.click()}
            className="flex flex-1 flex-col items-center justify-center gap-2 text-center w-full min-h-28 focus:outline-none"
          >
            <div className="rounded-full bg-alpac-primary-100 p-3 dark:bg-alpac-primary-900/30">
              <ImagePlus
                size={24}
                className="text-alpac-primary-600 dark:text-alpac-primary-400"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {isDragActive ? "Suelta aquí" : title ?? "Seleccionar imagen"}
              </p>
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Imágenes adjuntas ({value.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {value.map((item) => (
                <div
                  key={item.id}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 shadow-sm dark:border-slate-600 group"
                >
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                    aria-label={`Eliminar ${item.file.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {canAdd && (
                <button
                  type="button"
                  onClick={() => nativeInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1 shrink-0 rounded-md border border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 hover:border-alpac-primary-400 dark:border-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:border-alpac-primary-500"
                  aria-label="Añadir más imágenes"
                >
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-[10px] font-medium  text-slate-500">Añadir más imágenes</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
