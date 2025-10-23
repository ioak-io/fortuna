import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { FileService, FlashcardsService as FlashcardsServicePackage } from '@fortuna/content';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FlashcardService {
  private flashcardService: FlashcardsServicePackage

  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    this.flashcardService = new FlashcardsServicePackage(this.databaseService);
  }

  async generateStudyGuideForUnit(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    authHeaders: Record<string, string>,
  ): Promise<void> {
    return await this.flashcardService.requestFlashcardGeneration(
      realm,
      tenant,
      teamId,
      unitId,
      authHeaders
    );
  }
}
