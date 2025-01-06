export interface Domain {
  id: string;
  name: string;
  userId: string;
  expirationDate: Date | null;
  renewalDate: Date | null;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sslCertificates: SslCertificate[];
}

export interface SslCertificate {
  id: string;
  hostname: string;
  expirationDate: Date | null;
  lastCheckedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
