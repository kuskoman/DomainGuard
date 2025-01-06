export interface CreateDomainInput {
  name: string;
  userId: string;
}

export interface FindDomainsByUserInput {
  userId: string;
}

export interface FindDomainInput {
  id: string;
  userId?: string;
}

export interface RemoveDomainInput {
  id: string;
  userId?: string;
}

export interface UpdateExpirationDateInput {
  id: string;
  expirationDate: Date | null;
  renewalDate: Date | null;
}
