import { CompanyCommand } from "../command/CompanyCommand";

export class SelectCompanyCommandHandler {

    async execute(command: CompanyCommand): Promise<string> {
        return command.getCompanyId();
    }
} 