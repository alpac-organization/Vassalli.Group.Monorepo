export type PdfUploaderValue = {
  fileName: string | null;
  base64: string | null;
};

export type PdfUploaderProps = {
  fileName?: string | null;
  onChange: (next: PdfUploaderValue) => void;
  label?: string;
  error?: string | null;
  disabled?: boolean;
};
