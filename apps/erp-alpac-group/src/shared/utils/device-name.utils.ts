import { getBrowserName } from "@app/core/enums/user-agent.enum";

const Devices = {
   ["iPhone"]: "iPhone",
   ["iPad"]: "iPad",
   ["Android"]: "Android",
   ["Windows"]: "Windows",
   ["Macintosh"]: "Mac",
   ["CrOS"]: "Chrome OS",
   ["Linux"]: "Linux",
} as const;

export const getDeviceName = () => {

   const userAgent = navigator.userAgent;
   const browser = getBrowserName(userAgent);

   const device = Object.keys(Devices).find((key) => userAgent.includes(key));
   const deviceName = Devices[device as keyof typeof Devices];

   return `${browser} ${deviceName}`;
}