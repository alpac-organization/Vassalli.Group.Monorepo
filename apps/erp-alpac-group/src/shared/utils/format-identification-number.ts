/**
 * Formatea un string a formato de cédula nicaragüense (000-000000-0000X)
 * @param identification - El número de cédula (con o sin guiones)
 * @returns La cédula formateada o el valor original si no cumple el mínimo
 */
export const FormatIdentificationNumber = (identification: string): string => {
    if (!identification) return "";

    const clean = identification.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (clean.length < 14) return clean;

    const part1 = clean.substring(0, 3);
    const part2 = clean.substring(3, 9);
    const part3 = clean.substring(9, 13);
    const letter = clean.substring(13, 14);

    return `${part1}-${part2}-${part3}${letter}`;
};