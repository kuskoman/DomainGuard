export interface UserDetailsResponse {
  user: {
    email: string;
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  accessToken: string;
}
