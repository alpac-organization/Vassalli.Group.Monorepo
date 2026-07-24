export type QuoteImageUploaderProps = {
  value: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  error?: string;
};
