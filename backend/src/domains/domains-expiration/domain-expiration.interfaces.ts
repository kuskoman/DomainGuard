import whois from 'whois-json';

export interface ExpirationMetadata {
  expirationDate: Date | null;
  renewalDate: Date | null;
}

export type WhoisResult = Awaited<ReturnType<typeof whois>>;

// example:  {"domainName":"onet.pl","registrantType":"organization","nameservers":"ns5.ringpublishing.net.","created":"1996.06.22 01:00:00","lastModified":"2024.12.21 00:30:18","renewalDate":"2025.12.31 13:00:00","optionCreated":"2019.08.20 19:44:39","optionExpirationDate":"2025.08.20 19:44:39","dnssec":"Unsigned","registrar":"cyber_Folks S.A.","tel":"+48.122963663","whoisDatabaseResponses":"https://dns.pl/en/whois"}
export interface WhoisDataPossibleResponse {
  domainName: string;
  registrantType: string;
  nameservers: string;
  created: string;
  lastModified: string;
  renewalDate: string;
  optionCreated: string;
  optionExpirationDate: string;
  dnssec: string;
  registrar: string;
  tel: string;
  whoisDatabaseResponses: string;
}
