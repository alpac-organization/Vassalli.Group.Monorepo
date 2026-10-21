import type { IHttpHandler } from "@app/core/ports";
import type { IReasonsInventoryRemovalServices } from "../../application/interfaces/IReasons-inventory-removal-services";

export class ReasonsInventoryRemovalServices implements IReasonsInventoryRemovalServices {
	private readonly httpClient: IHttpHandler;
	
	constructor(httpClient: IHttpHandler) {
		this.httpClient = httpClient;
	}

	// All services here

	

}