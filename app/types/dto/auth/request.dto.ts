export interface AuthRequestDto {
  FindId: {
    email: string;
  };
  Login: {
    username: string;
    password: string;
  };
  ADMIN: {
    LOGIN: {
      username: string;
      password: string;
    };
  };
}
