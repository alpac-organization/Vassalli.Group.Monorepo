import { Users, Box, Settings, UsersRound } from "lucide-react";

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",

  items: [
    {
      id: "products",
      label: "Products",
      path: "products",
      icon: Box,
    },
    {
      id: "clients",
      label: "Clients",
      path: "clients",
      icon: Users,
    },
    {
      id: "colaboradores",
      label: "Colaboradores",
      path: "colaboradores",
      icon: UsersRound,
    },
    {
      id: "settings",
      label: "Settings",
      path: "settings",
      icon: Settings,
      isFooter: true,
    },
  ],
};
