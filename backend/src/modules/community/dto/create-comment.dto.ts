import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @MinLength(1, { message: 'Bình luận không được để trống' })
    @MaxLength(1000, { message: 'Bình luận không được vượt quá 1000 ký tự' })
    content: string;

    @IsOptional()
    @IsString()
    parentId?: string; // For replies
}
