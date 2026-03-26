/**
 * Valida el nombre y apellido del usuario
 * @param fullName string
 * @returns string
 */
export const validateNameAndLastName = (fullName: string): string => {

    if (!fullName) return "Usuario";

    const firstName = fullName.split(" ")[0];
    const splitFullName = fullName.split(" ");

    if (splitFullName.length === 1) return firstName;

    if (splitFullName.length === 2)
        return `${firstName} ${splitFullName[1]}`;

    if (splitFullName.length === 3 || splitFullName.length === 4)
        return `${firstName} ${splitFullName[2]}`;

    if (splitFullName.length > 4)
        return `${firstName} ${splitFullName[3]}`;

    return fullName;
}
