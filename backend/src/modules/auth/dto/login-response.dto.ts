export class LoginResponseDto {
  id: string;
  email: string;
  phone: string;
  firstName: string | null;
  lastName: string | null;
  avatar?: string | null;
  role: string;
  accessToken: string;
  birthDate?: string | null;
  province?: string | null;
  school?: string | null;
  major?: string | null;
  companyName?: string | null;
  website?: string | null;
  address?: string | null;
  position?: string | null;
  taxId?: string | null;
  isVerified?: boolean;
}
