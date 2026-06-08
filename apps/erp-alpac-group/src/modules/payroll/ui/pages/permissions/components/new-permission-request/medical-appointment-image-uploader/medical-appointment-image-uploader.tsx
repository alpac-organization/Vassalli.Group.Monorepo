import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";
import type {
  MedicalAppointmentImageUploaderProps,
  ImagePreview,
} from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/medical-appointment-image-uploader/medical-appointment-image-uploader.types";

const DEFAULT_MAX_FILES = 3;
const DEFAULT_MIN_FILES = 1;
const MAX_SIZE_BYTES = 3 * 1024 * 1024;

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function MedicalAppointmentImageUploader({
  value,
  onChange,
  maxFiles = DEFAULT_MAX_FILES,
  minFiles = DEFAULT_MIN_FILES,
  error,
}: MedicalAppointmentImageUploaderProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [dropError, setDropError] = useState<string | null>(null);
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const syncBase64Images = useCallback(
    async (items: ImagePreview[]) => {
      const base64Images = await Promise.all(
        items.map((item) => fileToBase64(item.file)),
      );
      onChange(base64Images);
    },
    [onChange],
  );

  const removeImage = useCallback(
    (id: string) => {
      setPreviews((current) => {
        const removed = current.find((item) => item.id === id);
        if (removed) URL.revokeObjectURL(removed.preview);

        const next = current.filter((item) => item.id !== id);
        void syncBase64Images(next);
        return next;
      });
    },
    [syncBase64Images],
  );

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  useEffect(() => {
    if (value.length === 0 && previewsRef.current.length > 0) {
      previewsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
      setPreviews([]);
    }
  }, [value.length]);

  const remainingSlots = maxFiles - previews.length;

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE_BYTES,
      maxFiles: remainingSlots,
      disabled: remainingSlots <= 0,
      onDrop: (acceptedFiles) => {
        setDropError(null);

        const newPreviews = acceptedFiles.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
        }));

        const merged = [...previews, ...newPreviews].slice(0, maxFiles);
        setPreviews(merged);
        void syncBase64Images(merged);
      },
      onDropRejected: (rejections) => {
        const firstError = rejections[0]?.errors[0];
        if (firstError?.code === "file-too-large") {
          setDropError("Cada imagen debe pesar menos de 3 MB.");
          return;
        }
        if (firstError?.code === "file-invalid-type") {
          setDropError("Solo se permiten imágenes JPG, PNG o WEBP.");
          return;
        }
        setDropError(
          "No se pudo adjuntar la imagen. Verifique el formato y el tamaño.",
        );
      },
    });

  const rejectionMessage = fileRejections[0]?.errors[0]?.message;
  const displayError = error ?? dropError ?? rejectionMessage ?? null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-black dark:text-white">
        Comprobantes médicos
        <span className="ml-1 text-red-500">*</span>
        <span className="ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
          ({minFiles} a {maxFiles} imágenes)
        </span>
      </span>

      <div className="grid min-w-0 grid-cols-3 gap-3">
        {previews.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-md border border-slate-200 dark:border-slate-600"
          >
            <img
              src={item.preview}
              alt={item.file.name}
              className="h-24 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(item.id)}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
              aria-label={`Eliminar ${item.file.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <div
            {...getRootProps()}
            className={`flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-2 text-center transition-colors ${
              isDragActive
                ? "border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
                : "border-slate-300 hover:border-alpac-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
            }`}
          >
            <input {...getInputProps()} />
            <ImagePlus
              size={20}
              className="text-slate-500 dark:text-slate-400"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {isDragActive ? "Suelta aquí" : "Agregar imagen"}
            </span>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
