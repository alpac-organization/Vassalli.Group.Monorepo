import { useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

export const DisciplinaryPageHeader = () => {
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col justify-center">
          <h3 className="m-0! p-0!">Gestión Disciplinaria</h3>
          <small className="mt-2 text-gray-500 dark:text-gray-300">
            Administra faltas y sanciones disciplinarias del personal
          </small>
        </div>
        <img
          className="h-12 w-auto object-contain sm:h-16 md:h-20"
          src={activeLogo}
          alt="logo alpac"
        />
      </div>
    </div>
  );
};
