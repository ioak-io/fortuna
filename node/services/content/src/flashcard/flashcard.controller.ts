import { Controller, Post, Get, Delete, Param, Req, HttpException, HttpStatus, Request, Inject, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { JwtClaims } from '@fortuna/middlewares';

interface RequestWithTenant extends Request {
  tenant: string;
  realm: string;
  team: string;
  claims: JwtClaims;
}

@Controller('units')
export class FlashcardController {
  constructor(@Inject(FlashcardService) private readonly flashcardService: FlashcardService) { }

  @Post(':unitId/flashcard')
  async createFlashcard(
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

      await this.flashcardService.generateStudyGuideForUnit(
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
      console.error('Error creating flashcard:', error);
      throw new InternalServerErrorException(
        `Failed to create flashcard: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
