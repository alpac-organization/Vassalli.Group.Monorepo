import { useState } from "react";
import { Modal } from "@alpac/design-system";
import type { ImagePreviewProps } from "./image-preview.types";

export const ImagePreview = ({
	images,
	title = "Vista previa",
	alt = "Vista previa de la imagen",
}: ImagePreviewProps) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	if (!images.length) return null;

	return (
		<>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
				{images.map((url, index) => (
					<div
						key={`${url}-${index}`}
						onClick={() => setSelectedImage(url)}
						className="group relative cursor-pointer overflow-hidden rounded-md border border-slate-200 dark:border-slate-600 transition-[border-color,box-shadow] duration-500 ease-out hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm"
					>
						<img
							src={url}
							alt={`${alt} ${index + 1}`}
							className="h-24 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
						/>
						<div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 ease-out group-hover:bg-black/10" />
					</div>
				))}
			</div>

			<Modal
				isOpen={Boolean(selectedImage)}
				onClose={() => setSelectedImage(null)}
				variant="default"
				title={title}
				panelClassName="!max-w-4xl w-[min(calc(100vw-1rem),56rem)]"
			>
				{selectedImage && (
					<div className="flex items-center justify-center rounded-lg bg-slate-100 p-4 dark:bg-[#1E232B]">
						<img
							src={selectedImage}
							alt={alt}
							className="max-h-[70vh] w-auto rounded-md object-contain shadow-lg"
						/>
					</div>
				)}
			</Modal>
		</>
	);
};
