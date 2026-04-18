import { IsString, IsOptional, IsInt, IsObject, Min, Max } from 'class-validator';

export class CreateSavedPortfolioDto {
    @IsString()
    name: string;

    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    headline?: string;

    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsObject()
    contactJson?: {
        email?: string;
        phone?: string;
        city?: string;
        district?: string;
        facebook?: string;
        github?: string;
    };

    @IsOptional()
    @IsObject()
    skills?: {
        selected: Array<{
            id: string;
            name: string;
            level: string;
        }>;
    };

    @IsOptional()
    @IsObject()
    experience?: {
        items: Array<{
            id: string;
            title: string;
            company: string;
            startDate: string;
            endDate?: string;
            description: string;
            isCurrent: boolean;
        }>;
    };

    @IsOptional()
    @IsObject()
    education?: {
        items: Array<{
            id: string;
            school: string;
            degree: string;
            field: string;
            graduationYear: string;
        }>;
    };

    @IsOptional()
    @IsObject()
    projects?: {
        items: Array<{
            id: string;
            title: string;
            description: string;
            url?: string;
            imageUrl?: string;
        }>;
    };

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    selectedTemplate?: number;
}
