type Extension = "xls" | "xlsx" | "csv";

export interface FileUploaderProps {
   title?: string;
   description?: string;
   extensions?: Extension[];
   onFileSelect?: (file: File) => void;
   onFileRemove?: () => void;
   onAction?: () => void;
}