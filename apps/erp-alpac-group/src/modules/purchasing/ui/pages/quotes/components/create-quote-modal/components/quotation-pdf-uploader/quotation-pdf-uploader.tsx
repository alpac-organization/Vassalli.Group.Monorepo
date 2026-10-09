import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, X } from "lucide-react";
import { fileToBase64 } from "@app/shared/utils/fileToBase64";

const MAX_PDF_SIZE_MB = 10;
const MAX_PDF_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

export type QuotationPdfUploaderProps = {
	fileName?: string | null;
	onChange: (next: { pdf_base64: string | null; pdf_file_name: string | null }) => void;
	error?: string | null;
	disabled?: boolean;
};

export function QuotationPdfUploader({
	fileName,
	onChange,
	error,
	disabled = false,
}: QuotationPdfUploaderProps) {
	const [dropError, setDropError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const clearPdf = useCallback(() => {
		setDropError(null);
		onChange({ pdf_base64: null, pdf_file_name: null });
	}, [onChange]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: { "application/pdf": [".pdf"] },
		maxFiles: 1,
		maxSize: MAX_PDF_BYTES,
		multiple: false,
		disabled: disabled || isLoading,
		onDrop: (acceptedFiles) => {
			const file = acceptedFiles[0];
			if (!file) return;

			if (!file.name.toLowerCase().endsWith(".pdf")) {
				setDropError("El archivo debe terminar en .pdf.");
				return;
			}

			setDropError(null);
			setIsLoading(true);

			void fileToBase64(file)
				.then((result) => {
					const base64 =
						typeof result === "string"
							? result
							: `data:${result.content_type};base64,${result.image_base64}`;
					onChange({
						pdf_base64: base64,
						pdf_file_name: file.name,
					});
				})
				.catch(() => {
					setDropError("No se pudo cargar el PDF. Intente nuevamente.");
				})
				.finally(() => {
					setIsLoading(false);
				});
		},
		onDropRejected: (rejections) => {
			const firstError = rejections[0]?.errors[0];
			if (firstError?.code === "file-too-large") {
				setDropError(`El PDF debe pesar como máximo ${MAX_PDF_SIZE_MB} MB.`);
				return;
			}
			if (firstError?.code === "file-invalid-type") {
				setDropError("Solo se permiten archivos PDF.");
				return;
			}
			setDropError("No se pudo adjuntar el PDF.");
		},
	});

	const displayError = error ?? dropError;

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-medium text-black dark:text-white">
				PDF de cotización (opcional)
			</span>

			{fileName ? (
				<div className="flex items-center justify-between gap-3 rounded-md border border-slate-300 bg-slate-50 px-3 py-2.5 dark:border-slate-600 dark:bg-[#1e2229]">
					<div className="flex min-w-0 items-center gap-2">
						<FileText size={18} className="shrink-0 text-alpac-primary-600" />
						<span className="truncate text-sm text-slate-700 dark:text-slate-200">
							{fileName}
						</span>
					</div>
					<button
						type="button"
						disabled={disabled || isLoading}
						onClick={clearPdf}
						className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-white"
						aria-label="Eliminar PDF"
					>
						<X size={16} />
					</button>
				</div>
			) : (
				<div
					{...getRootProps()}
					className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-3 py-6 text-center transition-colors ${
						isLoading
							? "pointer-events-none border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
							: isDragActive
								? "border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
								: "border-slate-300 hover:border-alpac-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
					}`}
				>
					<input {...getInputProps()} />
					<FileText size={22} className="text-slate-500 dark:text-slate-400" />
					<span className="text-xs text-slate-600 dark:text-slate-300">
						{isLoading
							? "Cargando PDF..."
							: isDragActive
								? "Suelta el PDF aquí"
								: "Arrastra o selecciona un PDF (máx. 10 MB)"}
					</span>
				</div>
			)}

			{displayError ? (
				<p className="m-0 text-[13px] text-red-500" role="alert">
					{displayError}
				</p>
			) : null}
		</div>
	);
}
