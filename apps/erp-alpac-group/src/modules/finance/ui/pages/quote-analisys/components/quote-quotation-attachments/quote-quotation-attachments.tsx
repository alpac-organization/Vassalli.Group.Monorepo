import { ExternalLink, FileText } from "lucide-react";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type { QuoteQuotationAttachmentsProps } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-quotation-attachments/quote-quotation-attachments.types";

export function QuoteQuotationAttachments({
	images,
	documents,
}: QuoteQuotationAttachmentsProps) {
	const imageList = (images ?? []).filter((file) => Boolean(file.file_url?.trim()));
	const documentList = (documents ?? []).filter((file) =>
		Boolean(file.file_url?.trim()),
	);

	if (imageList.length === 0 && documentList.length === 0) return null;

	const galleryImages = imageList.map((file) => ({
		file_name: file.file_name,
		image_url: file.file_url,
	}));

	return (
		<div className="mt-2 flex min-w-0 flex-col gap-2">
			{imageList.length > 0 ? (
				<ImagePreviewGallery
					images={galleryImages}
					title="Imágenes"
					imageAlt="Imagen de cotización"
				/>
			) : null}

			{documentList.length > 0 ? (
				<div className="flex min-w-0 flex-col gap-1.5">
					<span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
						<FileText className="h-3.5 w-3.5" />
						Documentos
					</span>
					<ul className="m-0 flex list-none flex-col gap-2 p-0">
						{documentList.map((file) => (
							<li key={file.file_id} className="min-w-0">
								<a
									href={file.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-slate-600 dark:bg-[#1e2229] dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10"
								>
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300">
										<FileText className="h-4 w-4" aria-hidden />
									</span>
									<span className="flex min-w-0 flex-1 flex-col gap-0.5">
										<span className="min-w-0 max-w-full whitespace-normal text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
											{file.file_name || "Documento"}
										</span>
										<span className="text-[11px] text-slate-500 dark:text-slate-400">
											PDF
										</span>
									</span>
									<span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-slate-700/70 dark:text-slate-200 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-200">
										Abrir
										<ExternalLink className="h-3 w-3" aria-hidden />
									</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}
