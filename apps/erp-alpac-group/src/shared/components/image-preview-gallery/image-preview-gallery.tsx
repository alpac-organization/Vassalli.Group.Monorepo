import { useState } from "react";
import { Modal } from "@alpac/design-system";
import { toDataUrl } from "@app/shared/utils/toDataUrl";

export interface ImagePayload {
  image_base64?: string | null;
  content_type?: string | null;
}

export interface ImagePreviewGalleryProps {
  images: ImagePayload[];
  title?: string;
}

export const ImagePreviewGallery = ({
  images,
  title = "Comprobantes médicos",
}: ImagePreviewGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-4 min-w-0">
      <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        {title}
      </span>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => {
          const src = toDataUrl(image.image_base64, image.content_type);
          if (!src) return null;

          return (
            <div
              key={`preview-imagen-${image.image_base64}-${index}`}
              onClick={() => setSelectedImage(src)}
              className="cursor-pointer overflow-hidden rounded-md border border-slate-200 dark:border-slate-600 transition-transform hover:scale-105 shadow-sm"
            >
              <img
                src={src}
                alt={`Comprobante cita medica`}
                className="h-24 w-full object-cover"
              />
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        variant="default"
        title="Vista previa del comprobante"
        panelClassName="!max-w-4xl w-[min(calc(100vw-1rem),56rem)]"
      >
        {selectedImage && (
          <div className="flex items-center justify-center p-4 bg-slate-100 dark:bg-[#1E232B] rounded-lg">
            <img
              src={selectedImage}
              alt="Vista previa ampliada"
              className="max-h-[70vh] w-auto object-contain rounded-md shadow-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
