const CONTROL_VACATIONS_SELECTION_STORAGE_PREFIX = "controlVacationsSelection:";

export const clearControlVacationsSelectionStorage = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CONTROL_VACATIONS_SELECTION_STORAGE_PREFIX))
    .forEach((key) => localStorage.removeItem(key));
};
