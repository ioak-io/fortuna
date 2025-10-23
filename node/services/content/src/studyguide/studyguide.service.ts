import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { FileService, StudyGuideService as StudyGuideServicePackage, StudyGuide } from '@fortuna/content';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StudyguideService {
  private studyGuideService: StudyGuideServicePackage

  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    this.studyGuideService = new StudyGuideServicePackage(this.databaseService);
  }

  async generateStudyGuideForUnit(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    authHeaders: Record<string, string>,
    similarityThreshold = 0.75
  ): Promise<void> {
    return await this.studyGuideService.requestStudyGuideGeneration(
      realm,
      tenant,
      teamId,
      unitId,
      authHeaders,
      similarityThreshold
    );
  }
}
