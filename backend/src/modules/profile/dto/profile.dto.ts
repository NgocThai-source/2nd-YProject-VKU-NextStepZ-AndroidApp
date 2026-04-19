import { IsString, IsOptional, IsArray, IsObject, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}

// ===== User Info DTO =====
export class UpdateUserInfoDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}

// ===== Personal Info DTO =====
export class SocialLinkDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  platform: string;

  @IsString()
  url: string;
}

export class UpdatePersonalInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsArray()
  socialLinks?: SocialLinkDto[];
}

// ===== Career Experience DTO =====
export class CreateExperienceDto {
  @IsString()
  position: string;

  @IsString()
  company: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

// ===== Skill DTO =====
export class CreateSkillDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ===== Education DTO =====
export class CreateEducationDto {
  @IsString()
  school: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  graduationYear?: string;
}

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  graduationYear?: string;
}

// ===== Professional Profile DTO =====
export class UpdateProfessionalProfileDto {
  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsArray()
  experiences?: CreateExperienceDto[];

  @IsOptional()
  @IsArray()
  skills?: CreateSkillDto[];

  @IsOptional()
  @IsArray()
  education?: CreateEducationDto[];
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: any;
}

export class PublicProfileResponseDto {
  id: string;
  userId: string;
  shareToken: string;
  isActive: boolean;
  viewCount: number;
  profile: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    province?: string;
    school?: string;
    major?: string;
    title?: string;
    city?: string;
    district?: string;
    objective?: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
}
