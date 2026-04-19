import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['post', 'question', 'job_posting', 'profile'])
    targetType: 'post' | 'question' | 'job_posting' | 'profile';

    @IsNotEmpty()
    @IsString()
    targetId: string;

    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsOptional()
    @IsString()
    description?: string;
}
