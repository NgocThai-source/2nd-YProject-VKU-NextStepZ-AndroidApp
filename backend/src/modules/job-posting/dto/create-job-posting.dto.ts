import { IsString, IsArray, IsOptional, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CompanyHistoryDto {
    @IsString()
    year: string;

    @IsString()
    milestone: string;
}

class JobPositionDto {
    @IsString()
    title: string;

    @IsNumber()
    minSalary: number;

    @IsNumber()
    maxSalary: number;
}

export class CreateJobPostingDto {
    @IsString()
    companyName: string;

    @IsOptional()
    @IsString()
    companyLogo?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    mission?: string;

    @IsOptional()
    @IsString()
    vision?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CompanyHistoryDto)
    companyHistory?: CompanyHistoryDto[];

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => JobPositionDto)
    jobPositions?: JobPositionDto[];

    @IsOptional()
    @IsString()
    workingHours?: string;

    @IsOptional()
    @IsNumber()
    offDays?: number;

    @IsOptional()
    @IsNumber()
    vacationDays?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    insurances?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    salaryBenefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowances?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    galleryImages?: string[];
}
