export interface UserDetailsResponse {
  email: string;
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export interface UserRegisterResponse {
  user: UserDetailsResponse;
  accessToken: string;
}
