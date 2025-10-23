import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [FlashcardController],
    providers: [FlashcardService],
})
export class FlashcardModule { }
