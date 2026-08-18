export interface ImageOutput {
  id: string;
  file: File;
  base64: string;
  preview: string;
  contentType: string;
}

export interface ImageUploaderProps {
  value?: ImageOutput[];
  onChange: (images: ImageOutput[]) => void;
  label?: string;
  title?: string;
  description?: string;
  maxFiles?: number;
  minFiles?: number;
  maxSizeMB?: number;
  error?: string | null;
  isRequired?: boolean;
  capture?: "user" | "environment";   /** Native capture attribute for mobile cameras user=> frontal, environment=> back */
}
