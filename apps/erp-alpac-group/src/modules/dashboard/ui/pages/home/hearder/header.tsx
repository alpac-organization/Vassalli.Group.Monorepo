import { Fragment } from "react";
import type { HeaderProps } from "./header.types";

export const HeaderHome = function ({ company_name, username }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { text: "¡Buen día!", emoji: "☀️" };
    } else if (hour >= 12 && hour < 18) {
      return { text: "¡Buenas tardes!", emoji: "⛅" };
    } else {
      return { text: "¡Buenas noches!", emoji: "🌙" };
    }
  };

  const { text, emoji } = getGreeting();
  return (
    <Fragment>
      <header className="max-w-330 m-auto p-3 mt-5 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Panel de Control
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {text} <span>{username}</span> {emoji}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Gestionando:{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {company_name}
            </span>
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            <span className="w-2 h-2 mr-2 rounded-full bg-green-500 animate-pulse"></span>
            Sistema en línea
          </div>
        </div>
      </header>

      <div className="max-w-330 m-auto p-3">
        <div className="h-px w-full bg-slate-200 dark:bg-slate-600 my-4"></div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          Módulos disponibles
        </h3>
      </div>
    </Fragment>
  );
};
