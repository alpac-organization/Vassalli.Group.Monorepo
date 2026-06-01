export const DESKTOP_SCROLL_CLASS = "payroll-periods-virtual-scroll";

export function PayrollPeriodsDesktopScrollStyles() {
  return (
    <style>{`
      .${DESKTOP_SCROLL_CLASS} {
        scrollbar-width: thin;
        scrollbar-color: #5b6575 #2c333d;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar {
        width: 10px;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar-track {
        border-radius: 9999px;
        background-color: #2c333d;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar-thumb {
        border-radius: 9999px;
        border: 2px solid #2c333d;
        background-clip: padding-box;
        background-color: #5b6575;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar-thumb:hover {
        background-color: #6b7280;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar-thumb:active {
        background-color: #9ca3af;
      }
      .${DESKTOP_SCROLL_CLASS}::-webkit-scrollbar-button {
        display: none;
        width: 0;
        height: 0;
      }
    `}</style>
  );
}
