import { apiClient } from '../client'
import type { RegisterUserInput } from './register'

export type LoginUserInput = RegisterUserInput
export interface LoginUserPayload {
  access_token: string
}

export const loginUser = async (input: LoginUserInput): Promise<LoginUserPayload> => {
  const userLoginResponse = await apiClient.post<LoginUserPayload>('users/login', input)
  return userLoginResponse.data
}
