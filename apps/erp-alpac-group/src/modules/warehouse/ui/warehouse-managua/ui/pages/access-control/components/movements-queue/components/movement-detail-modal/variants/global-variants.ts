// El objeto define las variaciones de estado para indicar si un movimiento es "Consolidado" o "No consolidado".
// Cada variante incluye una etiqueta y una clase de color para los estilos visuales en UI.
export const ConsolidatedVariations = {
  consolidated: {
    label: "Consolidado",
    color:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/50",
  },
  Unbound: {
    label: "No consolidado",
    color:
      "bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/45 dark:text-red-300 dark:border-red-800/40",
  },
};

// Estilos para los campos editables en el formulario.
export const editableFieldInputClasses = "text-[14px]! font-medium! ml-0.5!";

// Estilos base para los campos de entrada en el formulario.
export const baseInputClasses = `transition-all! duration-200! dark:bg-[#1e2229]! dark:border-slate-600/50! dark:px-3!
 focus:dark:border-cyan-500/60! focus:dark:ring-2! focus:dark:ring-cyan-500/20!
 disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!
 min-w-0 w-full max-w-full text-[14px]! font-medium! ml-0.5!`;

// Estilos para el título de las secciones en el formulario.
export const sectionTitleClasses =
  "m-0! text-[16px]! sm:text-[17px]! font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-4 sm:mb-5";

// Estilos para el grid de campos en el formulario.
export const fieldsGridClasses =
  "grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3";

// Estilos para el scroll en dispositivos móviles.
export const mobileOnlyScrollClasses = `
  max-md:overflow-y-auto max-md:overflow-x-hidden max-md:overscroll-contain
  max-md:max-h-[min(72dvh,42rem)] max-md:pr-1.5
  max-md:[scrollbar-gutter:stable]
  max-md:[scrollbar-width:thin]
  max-md:[scrollbar-color:rgba(148,163,184,0.75)_rgba(30,34,41,0.4)]
  max-md:[&::-webkit-scrollbar]:w-2
  max-md:[&::-webkit-scrollbar]:block
  max-md:[&::-webkit-scrollbar-track]:rounded-full
  max-md:[&::-webkit-scrollbar-track]:bg-slate-800/40
  max-md:[&::-webkit-scrollbar-thumb]:rounded-full
  max-md:[&::-webkit-scrollbar-thumb]:bg-slate-400/70
  md:overflow-visible md:max-h-none md:pr-0
`;
