import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StudyguideService } from './studyguide.service';
import { StudyguideController } from './studyguide.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [StudyguideController],
    providers: [StudyguideService],
})
export class StudyguideModule { }
