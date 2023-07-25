import { apiClient } from './client'

export interface GetDomainDto {
  id: string
  name: string
  userId: string
  expirationDate: string
  lastCheckedAt: string
  createdAt: string
  updatedAt: string
}

export const listDomains = async (): Promise<GetDomainDto[]> => {
  const domainsListResponse = await apiClient.get('domains')
  return domainsListResponse.data
}
