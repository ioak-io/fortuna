import { Controller, Post, Get, Delete, Param, Req, HttpException, HttpStatus, Request, Inject, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudyguideService } from './studyguide.service';
import { FileResponse, StudyGuide } from '@fortuna/content';
import { JwtClaims } from '@fortuna/middlewares';

interface RequestWithTenant extends Request {
  tenant: string;
  realm: string;
  team: string;
  claims: JwtClaims;
}

@Controller('units')
export class StudyguideController {
  constructor(@Inject(StudyguideService) private readonly studyguideService: StudyguideService) { }

  @Post(':unitId/studyguide')
  async createStudyguide(
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

      await this.studyguideService.generateStudyGuideForUnit(
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
      console.error('Error creating studyguide:', error);
      throw new InternalServerErrorException(
        `Failed to create studyguide: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
