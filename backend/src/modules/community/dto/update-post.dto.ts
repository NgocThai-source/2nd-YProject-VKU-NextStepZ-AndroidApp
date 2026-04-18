import { IsString, IsOptional, IsArray, MaxLength, MinLength, IsIn } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'Bài viết phải có ít nhất 10 ký tự' })
    @MaxLength(5000, { message: 'Bài viết không được vượt quá 5000 ký tự' })
    content?: string;

    @IsOptional()
    @IsString()
    @IsIn(['job-search', 'experience', 'discussion', 'question', 'offer', 'opportunity'])
    category?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    topics?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hashtags?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
