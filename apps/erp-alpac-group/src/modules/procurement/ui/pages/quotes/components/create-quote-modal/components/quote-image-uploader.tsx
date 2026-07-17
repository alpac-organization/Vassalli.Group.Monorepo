import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Modal, Spinner } from "@alpac/design-system";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";

type QuoteImageUploaderProps = {
  value: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  error?: string;
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_LOADING_MS = 1500;
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export function QuoteImageUploader({
  value,
  onChange,
  maxFiles = 3,
  error,
}: QuoteImageUploaderProps) {
  const [dropError, setDropError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isBusy = isUploading || removingIndex !== null;
  const remainingSlots = Math.max(maxFiles - value.length, 0);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE_BYTES,
      maxFiles: remainingSlots,
      disabled: remainingSlots <= 0 || isBusy,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setDropError(null);
        setIsUploading(true);

        void Promise.all([
          Promise.all(acceptedFiles.map((file) => fileToBase64(file))),
          new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
        ])
          .then(([images]) => {
            const dataUrls = images.map(
              (image) =>
                `data:${image.content_type};base64,${image.image_base64}`,
            );
            onChange([...value, ...dataUrls].slice(0, maxFiles));
          })
          .catch(() => {
            setDropError("No se pudo cargar la imagen. Intente nuevamente.");
          })
          .finally(() => {
            setIsUploading(false);
          });
      },
      onDropRejected: (rejections) => {
        const firstError = rejections[0]?.errors[0];
        if (firstError?.code === "file-too-large") {
          setDropError("Cada imagen debe pesar como máximo 5 MB.");
          return;
        }
        if (firstError?.code === "file-invalid-type") {
          setDropError("Solo se permiten imágenes PNG, JPG o WEBP.");
          return;
        }
        setDropError(`Puede adjuntar hasta ${maxFiles} imágenes por producto.`);
      },
    });

  const removeImage = (index: number) => {
    if (isBusy) return;

    setDropError(null);
    setRemovingIndex(index);
    setSelectedImage(null);

    const nextImages = value.filter((_, imageIndex) => imageIndex !== index);

    window.setTimeout(() => {
      onChange(nextImages);
      setRemovingIndex(null);
    }, MIN_LOADING_MS);
  };

  const rejectionMessage = fileRejections[0]?.errors[0]?.message;
  const displayError = error ?? dropError ?? rejectionMessage ?? null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-black dark:text-white">
        Imágenes del producto
      </span>

      <div className="grid min-w-0 grid-cols-3 gap-3">
        {value.map((image, index) => {
          const isRemoving = removingIndex === index;

          return (
            <div
              key={`${image.slice(-32)}-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!isBusy) setSelectedImage(image);
              }}
              onKeyDown={(event) => {
                if (isBusy) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedImage(image);
                }
              }}
              className={`relative overflow-hidden rounded-md border border-slate-200 shadow-sm transition-transform dark:border-slate-600 ${
                isBusy ? "cursor-default" : "cursor-pointer hover:scale-105"
              }`}
            >
              <img
                src={image}
                alt={`Imagen ${index + 1} del producto`}
                className={`h-24 w-full object-cover ${isRemoving ? "opacity-40" : ""}`}
              />

              {isRemoving ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45">
                  <Spinner size="small" className="text-white!" />
                  <span className="text-[11px] font-medium text-white">
                    Eliminando...
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Eliminar imagen ${index + 1}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}

        {(remainingSlots > 0 || isUploading) && (
          <div
            {...getRootProps()}
            className={`relative flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-2 text-center transition-colors ${
              isUploading
                ? "pointer-events-none border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
                : isDragActive
                  ? "border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
                  : "border-slate-300 hover:border-alpac-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <>
                <Spinner size="small" className="text-alpac-primary-600!" />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Cargando...
                </span>
              </>
            ) : (
              <>
                <ImagePlus
                  size={20}
                  className="text-slate-500 dark:text-slate-400"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {isDragActive ? "Suelta aquí" : "Agregar imagen"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
          {displayError}
        </p>
      )}

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        variant="default"
        title="Vista previa del producto"
        panelClassName="!max-w-4xl w-[min(calc(100vw-1rem),56rem)]"
      >
        {selectedImage && (
          <div className="flex items-center justify-center rounded-lg bg-slate-100 p-4 dark:bg-[#1E232B]">
            <img
              src={selectedImage}
              alt="Vista previa ampliada"
              className="max-h-[70vh] w-auto rounded-md object-contain shadow-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
