import { apiClient } from '../client'

export interface RegisterUserInput {
  email: string
  password: string
}

export interface RegisterUserResponse {
  email: string
  id: string
}

export const registerUser = async (input: RegisterUserInput): Promise<RegisterUserResponse> => {
  const registerResponse = await apiClient.post<RegisterUserResponse>('users/register', input)
  return registerResponse.data
}
