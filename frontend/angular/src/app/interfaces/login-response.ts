import { User } from "../interfaces/user";

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}
