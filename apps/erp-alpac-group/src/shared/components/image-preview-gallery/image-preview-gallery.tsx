import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { ZoomInIcon } from "lucide-react";
import { toDataUrl } from "@app/shared/utils/toDataUrl";

export interface ImagePayload {
  image_base64?: string | null;
  content_type?: string | null;
}

export interface ImagePreviewGalleryProps {
  images: ImagePayload[];
  title?: string;
  imageAlt?: string;
}

export const ImagePreviewGallery = ({
  images,
  title = "Comprobantes médicos",
  imageAlt = "Imagen adjunta",
}: ImagePreviewGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  const displayImages = images
    .map((image) => toDataUrl(image.image_base64, image.content_type))
    .filter((src): src is string => Boolean(src));

  if (displayImages.length === 0) return null;

  const rows: string[][] = [];
  
  if (displayImages.length === 2) {
    rows.push(displayImages);
  } else {
    let isOne = true;
    let i = 0;
    while (i < displayImages.length) {
      const take = isOne ? 1 : 2;
      rows.push(displayImages.slice(i, i + take));
      i += take;
      isOne = !isOne;
    }
  }

  return (
    <div className={`flex flex-col gap-2 min-w-0 ${title ? "mt-4" : ""}`}>
      {title ? (
        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {title}
        </span>
      ) : null}

      <p className="m-0 text-[12px] text-slate-500 dark:text-slate-400">
        Haz clic en una imagen para ampliarla
      </p>

      <div className="mx-auto flex w-full max-w-lg flex-col items-center py-4">
        {rows.map((row, rowIndex) => (
          <div
            key={`honeycomb-row-${rowIndex}`}
            className={`flex justify-center gap-2 ${rowIndex > 0 ? "-mt-8" : ""}`}
          >
            {row.map((src, colIndex) => {
              const globalIndex = rowIndex * 2 + colIndex; 
              return (
                <div
                  key={`preview-imagen-${src.slice(-32)}-${globalIndex}`}
                  role="button"
                  tabIndex={0}
                  title="Clic para ampliar"
                  aria-label={`Ampliar ${imageAlt} ${globalIndex + 1}`}
                  onClick={() => setSelectedImage(src)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedImage(src);
                    }
                  }}
                  className="group relative flex h-36 w-32 shrink-0 cursor-pointer items-center justify-center overflow-hidden bg-slate-200 transition-transform hover:z-10 hover:scale-[1.03] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-slate-800 [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]"
                >
                  <img
                    src={src}
                    alt={`${imageAlt} ${globalIndex + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-950/0 opacity-0 transition-all duration-200 group-hover:bg-slate-950/55 group-hover:opacity-100 group-focus-visible:bg-slate-950/55 group-focus-visible:opacity-100">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm dark:bg-slate-100">
                      <ZoomInIcon size={18} aria-hidden />
                    </span>
                    <span className="text-[11px] font-medium text-white">
                      Ampliar
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        variant="default"
        title="Vista previa ampliada"
        panelClassName="!max-w-4xl w-[min(calc(100vw-1rem),56rem)]"
      >
        {selectedImage && (
          <div className="flex items-center justify-center rounded-lg bg-slate-100 p-4 dark:bg-[#1E232B]">
            <img
              src={selectedImage}
              alt={`Vista previa de ${imageAlt.toLowerCase()}`}
              className="max-h-[70vh] w-auto rounded-md object-contain shadow-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
