import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { QuizService as QuizServicePackage } from '@fortuna/content';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class QuizService {
  private quizsService: QuizServicePackage

  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    this.quizsService = new QuizServicePackage(this.databaseService);
  }

  async generateQuizForUnit(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    authHeaders: Record<string, string>,
  ): Promise<void> {
    return await this.quizsService.requestQuizGeneration(
      realm,
      tenant,
      teamId,
      unitId,
      authHeaders
    );
  }
}
