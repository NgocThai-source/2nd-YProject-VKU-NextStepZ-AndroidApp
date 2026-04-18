export class RegisterResponseDto {
  id: string;
  email: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  birthDate?: string | null;
  role: string;
  accessToken: string;
  message: string;
}
