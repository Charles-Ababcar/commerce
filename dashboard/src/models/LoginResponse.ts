export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  message: string;
  data: LoginResponseData;
}
