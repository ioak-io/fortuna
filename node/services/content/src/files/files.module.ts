import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [FilesController],
    providers: [FilesService],
})
export class FilesModule { }
