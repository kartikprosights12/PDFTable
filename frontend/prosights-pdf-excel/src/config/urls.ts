type EnvUrls = {
  apiBaseUrl: string;
  frontendUrl: string;
};

const local: EnvUrls = {
  apiBaseUrl: "http://localhost:8000",
  frontendUrl: "http://localhost:3000",
};

const development: EnvUrls = {
  apiBaseUrl: "https://prism-api.prosights.co",
  frontendUrl: "https://prism.prosights.co",
};

const production: EnvUrls = {
  apiBaseUrl: "https://prism-api.prosights.co",
  frontendUrl: "https://prism.prosights.co",
};

const config: Record<string, EnvUrls> = {
  development,
  local,
  production,
};
const activeEnv = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development";

console.log('Active Environment:', activeEnv);

export const urls = config[activeEnv as keyof typeof config];
console.log('Selected URLs:', urls);
