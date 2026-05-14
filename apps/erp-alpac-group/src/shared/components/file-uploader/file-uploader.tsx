import { m, LazyMotion, AnimatePresence } from "framer-motion";
import type { FileUploaderProps } from "./file-uploader.types";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { useCallback, useRef, useState } from "react";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const FileUploader = ({
  title,
  description,
  extensions,
  onFileSelect,
  onFileRemove,
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    const validExtensions = extensions?.map((ext: string) => `.${ext}`);

    if (validExtensions?.includes(fileExtension)) {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else {
      setShowAlert({
        show: true,
        type: "error",
        title: "Archivo no válido",
        message:
          "Por favor seleccione un archivo Excel (.xls, .xlsx) o CSV permitido.",
      });
      handleCloseAlert();
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileRemove?.();
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="lg:col-span-2">
        <div className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#272b34]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={extensions?.map((ext) => `.${ext}`).join(",")}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <m.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-10 transition-all duration-300 ${
                  isDragging
                    ? "scale-[1.02] border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10"
                    : "border-slate-300 hover:border-alpac-primary-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="mb-4 rounded-full bg-alpac-primary-100 p-4 dark:bg-alpac-primary-900/30">
                  <UploadCloud
                    className="text-alpac-primary-600 dark:text-alpac-primary-400"
                    size={40}
                  />
                </div>

                <p className="text-center text-lg font-medium text-slate-700 dark:text-slate-200">
                  {title ?? "Arrastra y suelta tu archivo aquí"}
                </p>

                <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  {description ??
                    `O haz clic para explorar tus archivos (${extensions?.join(", ")})`}
                </p>
              </m.div>
            ) : (
              <m.div
                key="file-info"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative flex flex-1 flex-col items-center justify-center rounded-md border border-alpac-primary-200 bg-alpac-primary-50/30 p-10 dark:border-alpac-primary-800 dark:bg-alpac-primary-900/5"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <X size={20} />
                </button>

                <div className="relative mb-4">
                  <FileIcon className="text-alpac-primary-500" size={64} />
                  <CheckCircle2
                    className="absolute -right-1 -bottom-1 rounded-full bg-white text-emerald-500 dark:bg-[#272b34]"
                    size={24}
                  />
                </div>

                <h5 className="mb-1 max-w-full truncate px-4 text-xl font-bold text-slate-800 dark:text-white">
                  {selectedFile.name}
                </h5>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <p className="max-w-md text-center text-sm text-slate-600 dark:text-slate-300">
                  Archivo listo. Use &quot;Registrar ingreso&quot; para enviarlo
                  con la nómina.
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatedAlertWrapper open={showAlert.show}>
        <Alert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
        />
      </AnimatedAlertWrapper>
    </LazyMotion>
  );
};
