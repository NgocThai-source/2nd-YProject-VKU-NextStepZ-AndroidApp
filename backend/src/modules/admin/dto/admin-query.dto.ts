import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

export class VerifyEmployerDto {
    @IsBoolean()
    verified: boolean;

    @IsOptional()
    @IsString()
    reason?: string;
}

export class BanUserDto {
    @IsBoolean()
    banned: boolean;

    @IsOptional()
    @IsString()
    reason?: string;
}

export class ApproveJobDto {
    @IsBoolean()
    approved: boolean;

    @IsOptional()
    @IsString()
    rejectionReason?: string;
}
