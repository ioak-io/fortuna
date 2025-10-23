import { Controller, Post, Get, Delete, Param, Req, HttpException, HttpStatus, Request, Inject, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtClaims } from '@fortuna/middlewares';

interface RequestWithTenant extends Request {
  tenant: string;
  realm: string;
  team: string;
  claims: JwtClaims;
}

@Controller('units')
export class QuizController {
  constructor(@Inject(QuizService) private readonly quizService: QuizService) { }

  @Post(':unitId/quiz')
  async createQuiz(
    @Param('unitId') unitId: string,
    @Req() req: RequestWithTenant,
  ): Promise<void> {

    try {
      const unitIdNum = parseInt(unitId);
      if (isNaN(unitIdNum)) {
        throw new BadRequestException('Invalid unit ID');
      }

      // Extract auth headers from request
      const authHeaders = {
        authorization: req.headers.authorization || '',
        'x-tenant': req.tenant || ''
      };

      console.log(authHeaders);

      await this.quizService.generateQuizForUnit(
        req.realm,
        req.tenant,
        req.team,
        unitIdNum,
        authHeaders
      );

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating quiz:', error);
      throw new InternalServerErrorException(
        `Failed to create quiz: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
