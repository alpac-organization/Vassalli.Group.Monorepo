const UserAgentEnum = {
   ["SamsungBrowser"]: "Samsung Browser",
   ["OPR"]: "Opera",
   ["MSIE"]: "Internet Explorer",
   ["Edge"]: "Microsoft Edge",
   ["Chrome"]: "Google Chrome",
   ["Safari"]: "Apple Safari",
   ["Firefox"]: "Mozilla Firefox",
} as const;

export const getBrowserName = (keyUserAgent: string): any => {
   const [browserName] = Object.keys(UserAgentEnum).filter((key) => keyUserAgent.includes(key))
   return UserAgentEnum[browserName as keyof typeof UserAgentEnum] ?? "Unknown";
}
