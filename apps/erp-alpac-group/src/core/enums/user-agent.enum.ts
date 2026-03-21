
export const UserAgentEnum = {
    FIREFOX: "Mozilla Firefox",
    SAMSUNG_BROWSER: "Samsung Browser",
    OPERA: "Opera",
    INTERNET_EXPLORER: "Internet Explorer",
    MICROSOFT_EDGE: "Microsoft Edge",
    GOOGLE_CHROME: "Google Chrome",
    APPLE_SAFARI: "Apple Safari",
} as const;

export type UserAgentType = (typeof UserAgentEnum)[keyof typeof UserAgentEnum];
