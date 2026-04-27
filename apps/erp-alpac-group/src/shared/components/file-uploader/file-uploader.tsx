import { AnimatePresence } from "framer-motion";
import type { FileUploaderProps } from "./file-uploader.types";
import { motion } from "framer-motion";
import { FileIcon, UploadCloud, X } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { useCallback, useRef, useState } from "react";

export const FileUploader = ({ title, description, extensions }: FileUploaderProps) => {

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
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const validExtensions = extensions?.map((ext: string) => `.${ext}`);

      if (validExtensions?.includes(fileExtension)) {
         setSelectedFile(file);
      } else {
         setShowAlert({
            show: true,
            type: "error",
            title: "Archivo no válido",
            message: "Por favor seleccione un archivo Excel (.xls, .xlsx) o CSV."
         });
         handleCloseAlert();
      }
   };

   const removeFile = () => {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
   };

   const handleCloseAlert = useCallback(() => {
      setTimeout(() => {
         setShowAlert((prev) => ({ ...prev, show: false }));
      }, 3000);
   }, []);

   const handleUpload = () => {
      if (!selectedFile) return;

      // Simulación de carga
      setShowAlert({
         show: true,
         type: "success",
         title: "Archivo procesado",
         message: `El archivo "${selectedFile.name}" ha sido cargado correctamente para su procesamiento.`
      });

      setSelectedFile(null);
      handleCloseAlert();
   };

   return (
      <div>
         <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#272b34] p-8 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">

               <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept={extensions?.map(ext => `.${ext}`).join(",")}
                  className="hidden"
               />

               <AnimatePresence mode="wait">
                  {!selectedFile ? (
                     <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300 ${isDragging
                           ? "border-alpac-primary-500 bg-alpac-primary-50 dark:bg-alpac-primary-900/10 scale-[1.02]"
                           : "border-slate-300 dark:border-slate-600 hover:border-alpac-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                           }`}
                     >
                        <div className="bg-alpac-primary-100 dark:bg-alpac-primary-900/30 p-4 rounded-full mb-4">
                           <UploadCloud className="text-alpac-primary-600 dark:text-alpac-primary-400" size={40} />
                        </div>

                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200 text-center">
                           {title ?? "Arrastra y suelta tu archivo aquí"}
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                           {description ?? `O haz clic para explorar tus archivos (${extensions?.join(", ")})`}
                        </p>

                     </motion.div>
                  ) : (
                     <motion.div
                        key="file-info"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 border border-alpac-primary-200 dark:border-alpac-primary-800 bg-alpac-primary-50/30 dark:bg-alpac-primary-900/5 rounded-md flex flex-col items-center justify-center p-10 relative"
                     >
                        <button
                           onClick={(e) => { e.stopPropagation(); removeFile(); }}
                           className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                        >
                           <X size={20} />
                        </button>

                        <div className="relative mb-4">
                           <FileIcon className="text-alpac-primary-500" size={64} />
                           <CheckCircle2 className="absolute -bottom-1 -right-1 text-emerald-500 bg-white dark:bg-[#272b34] rounded-full" size={24} />
                        </div>

                        <h5 className="text-xl font-bold text-slate-800 dark:text-white mb-1 truncate max-w-full px-4">
                           {selectedFile.name}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                           {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                           <Button
                              label="Cargar Archivo"
                              icon={<CheckCircle2 size={18} />}
                              className="flex-1! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                              onClick={handleUpload}
                           />
                        </div>
                     </motion.div>
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
      </div>
   );
};