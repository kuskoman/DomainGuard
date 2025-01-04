import { ConfigType, registerAs } from '@nestjs/config';

export const DOMAINS_CONFIG_KEY = 'DOMAINS_CONFIG_KEY';

export const domainsConfig = registerAs(DOMAINS_CONFIG_KEY, () => ({
  domainExpirationCheckIntervalDays: 1,
  sslCertificateExpirationCheckIntervalHours: 8,
}));

export type DomainsConfig = ConfigType<typeof domainsConfig>;
