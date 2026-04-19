import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateConversationDto {
    @IsString()
    participantId: string;
}

export class SendMessageDto {
    @IsString()
    conversationId: string;

    @IsString()
    content: string;

    @IsString()
    @IsIn(['text', 'image', 'portfolio'])
    type: 'text' | 'image' | 'portfolio';

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    portfolioId?: string;
}
