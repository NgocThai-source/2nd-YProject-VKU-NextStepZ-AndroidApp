import { Module } from '@nestjs/common';
import { SavedPortfolioController } from './saved-portfolio.controller';
import { SavedPortfolioService } from './saved-portfolio.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SavedPortfolioController],
    providers: [SavedPortfolioService],
    exports: [SavedPortfolioService],
})
export class SavedPortfolioModule { }
