import { ButtonRounded } from "@alpac/design-system";
import { m, LazyMotion } from "framer-motion"
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { SettingSidebar } from "./components/setting-sidebar/setting-sidebar";
import type { SettingSidebarMenuItem } from "./components/setting-sidebar/types/setting-sidebar.types";
import { useState } from "react";
import { Profile } from "./components/profile/profile";
import { Appearance } from "./components/appearence/appearence";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const SettingIndex = () => {

    const navigate = useNavigate();
    const { alias_company } = useParams<{ alias_company: string }>();

    const SETTING_ITEMS = [
        {
            id: "profile",
            label: "Perfil",
            backgroundColor: "#464a55",
            selectedBackgroundColor: "#2962ff",
        },
        {
            id: "appearance",
            label: "Apariencia",
            backgroundColor: "#464a55",
            selectedBackgroundColor: "#2962ff",
        },
    ] as SettingSidebarMenuItem[];

    const [selectedItemId, setSelectedItemId] = useState<string>(SETTING_ITEMS[0]!.id);

    const handleSelectItem = (itemId: string) => {
        console.log("handleSelectItem", itemId);
        setSelectedItemId(itemId);
    };

    const handleBack = () => {
        const alias = alias_company ?? CookieStorageAdapter.getCompanyAlias();
        if (!alias) return;
        navigate(`/${alias}/dashboard`);
    };

    return (
        <LazyMotion features={loadFeatures} strict>
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-330 m-auto flex w-full flex-col gap-4 sm:py-5 md:py-6 lg:py-8">

                <div className="flex w-full flex-col">

                    <div className="flex w-full items-center justify-between">

                        <div className="w-full">

                            <div className="mb-4 flex flex-row items-center justify-start gap-2 sm:mb-5 md:mb-6">

                                <ButtonRounded
                                    hasIcon
                                    icon={ArrowLeft}
                                    iconSize={16}
                                    className="left-[-70px] md:w-15! h-8! shadow-md rounded-full 
                                                focus:ring-[#286fe0]! 
                                                focus:ring-offset-[#1568ed]! 
                                                bg-[#2962ff]! 
                                                hover:border-alpac-primary-500!
                                                text-black! dark:text-white!"
                                    onClick={handleBack} />

                                <div className="flex flex-col justify-center">
                                    <h3 className="p-0! m-0!">Configuración</h3>
                                </div>

                            </div>

                            <div className="flex w-full flex-row gap-2 sm:gap-3 md:gap-4">
                                <SettingSidebar
                                    items={SETTING_ITEMS}
                                    selectedItemId={selectedItemId}
                                    onSelectItem={handleSelectItem}
                                />
                                <div className="w-full min-w-0 flex-1 rounded-md border border-slate-600 bg-[#272b34] p-3 sm:p-4 md:p-5 lg:p-6">
                                    {selectedItemId === "profile" && <Profile />}
                                    {selectedItemId === "appearance" && <Appearance />}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </m.div>
        </LazyMotion>
    )
}