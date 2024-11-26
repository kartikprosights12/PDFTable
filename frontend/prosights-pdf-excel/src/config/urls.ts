type EnvUrls = {
  apiBaseUrl: string;
  frontendUrl: string;
};

const local: EnvUrls = {
  apiBaseUrl: "http://localhost:8000",
  frontendUrl: "http://localhost:3000",
};

const development: EnvUrls = {
  apiBaseUrl: "http://34.30.62.54:8000",
  frontendUrl: "http://34.30.62.54:3000",
};

const config: Record<string, EnvUrls> = {
  development,
  local
};
const activeEnv = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development";

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.NEXT_PUBLIC_ENV', process.env.NEXT_PUBLIC_ENV);

export const urls = config[activeEnv as keyof typeof config];
