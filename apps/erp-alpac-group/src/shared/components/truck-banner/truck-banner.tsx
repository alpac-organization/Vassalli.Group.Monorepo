
import bannerTrucksWarehouse from "@app/assets/banners/banner-trucks-warehouse.webp";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { TruckBannerProps } from "./truck-banner.types";

export const TruckBanner = ({ title, subTitle }: TruckBannerProps) => {

    const { companyName } = useUserStore();
    const { neutralUrlImage } = useCompanyStore();

    return (
        <div className="
                relative h-[100px] -mx-4 -mt-4 mb-4 overflow-hidden rounded-t-xl 
                bg-gradient-to-br 
                from-[#092D67] 
                via-[#0E4194] 
                to-[#154DA8] 
                
                text-white 
                flex 
                items-center 
                justify-between">

            <img
                className="absolute h-[100px] w-85 object-cover right-[0px] [mask-image:linear-gradient(to_left,black_50%,transparent_100%)]"
                src={bannerTrucksWarehouse}
                alt="Registro de báscula"
                width={200}

            />
            <img
                src={neutralUrlImage}
                alt={companyName}
                className="ml-3 h-15 w-15 shrink-0"
            />
            <div className="p-0! absolute inset-0 flex flex-col items-center justify-center text-center">

                <h4 className="m-0! text-2xl font-semibold text-white">
                    {title}
                </h4>
                <p className="m-0! text-sm text-white">
                    {subTitle}
                </p>
            </div>
        </div>
    );
}