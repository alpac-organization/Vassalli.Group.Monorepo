import { Settings, UsersRound } from "lucide-react";

export const sidebarData = {
  logoUrl:
    "https://ui-avatars.com/api/?name=CP&background=2962ff&color=fff&rounded=true",
  nameCompany: "CORE PANEL",

  items: [
    {
      id: "collaborators",
      label: "Colaboradores",
      path: "payroll/collaborators",
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
