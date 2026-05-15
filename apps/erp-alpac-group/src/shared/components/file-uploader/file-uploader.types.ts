type Extension = "xls" | "xlsx" | "csv";

export interface FileUploaderProps {
   title?: string;
   description?: string;
   extensions?: Extension[];
   /** Texto del botón de envío mostrado cuando el archivo está listo */
   readySubmitLabel?: string;
   onFileSelect?: (file: File) => void;
   onFileRemove?: () => void;
   onAction?: () => void;
}