const baseEnvVars = {
  API_URL: "http://localhost:3000",
} as const;

export const getEnv = (envName: keyof typeof baseEnvVars): string => {
  const baseValue = baseEnvVars[envName];
  const environment: Record<string, string> = (window as any)?.__environment;

  return environment?.[envName] || baseValue;
};
