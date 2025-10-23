import { Controller, Post, Get, Delete, Param, Req, HttpException, HttpStatus, Request, Inject, UseInterceptors, UploadedFile, BadRequestException, InternalServerErrorException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponse } from '@fortuna/content';
import { JwtClaims } from '@fortuna/middlewares';

interface RequestWithTenant extends Request {
  tenant: string;
  realm: string;
  team: string;
  claims: JwtClaims;
}

@Controller('units')
export class FilesController {
  constructor(@Inject(FilesService) private readonly filesService: FilesService) { }

  @Post(':unitId/files')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    preservePath: true,
  }))
  async createFile(
    @Param('unitId') unitId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithTenant,
  ): Promise<FileResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Use teamId from path parameter
      const unitIdNum = parseInt(unitId);
      if (isNaN(unitIdNum)) {
        throw new BadRequestException('Invalid unit ID');
      }

      // Create file data from uploaded file
      const fileData = {
        original_filename: file.originalname,
        storage_key: `uploads/${req.team}/${unitId}/${file.filename || file.originalname}`, // You might want to generate a unique filename
        mime_type: file.mimetype,
        size_bytes: file.size,
        checksum: '', // You might want to calculate this
        metadata: {
          uploaded_at: new Date().toISOString(),
          original_name: file.originalname
        },
        uploaded_by: req.claims?.sub || null // User ID from JWT claims
      };

      // Get OCR API URL from environment variables
      const chunkSize = parseInt(process.env.CHUNK_SIZE || '250');
      const chunkOverlap = parseInt(process.env.CHUNK_OVERLAP || '40');

      // Extract auth headers from the request
      const authHeaders = {
        authorization: req.headers.authorization,
        'x-tenant': req.headers['x-tenant'] as string
      };

      console.log(authHeaders);

      // Use the original buffer directly to avoid corruption
      const fileBuffer = file.buffer;

      // Use the new multi-step process with OCR and chunking
      return await this.filesService.createFileWithOcrAndChunks(
        req.realm,
        req.tenant,
        req.team,
        unitIdNum,
        fileData,
        fileBuffer,
        chunkSize,
        chunkOverlap,
        authHeaders,
        file.mimetype
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating file:', error);
      throw new InternalServerErrorException(
        `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  @Get(':unitId/files')
  async getFilesByUnit(
    @Param('unitId') unitId: string,
    @Req() req: RequestWithTenant,
  ): Promise<FileResponse[]> {
    try {
      // Use teamId from path parameter
      const unitIdNum = parseInt(unitId);
      if (isNaN(unitIdNum)) {
        throw new BadRequestException('Invalid unit ID');
      }

      return await this.filesService.getFilesByUnit(req.realm, req.tenant, req.team, unitIdNum);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error fetching files:', error);
      throw new InternalServerErrorException(
        `Failed to fetch files: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  @Delete(':unitId/files/:fileId')
  async deleteFile(
    @Param('unitId') unitId: string,
    @Param('fileId') fileId: string,
    @Req() req: RequestWithTenant,
  ): Promise<{ success: boolean }> {
    try {
      const unitIdNum = parseInt(unitId);
      const fileIdNum = parseInt(fileId);

      if (isNaN(unitIdNum)) {
        throw new BadRequestException('Invalid unit ID');
      }

      if (isNaN(fileIdNum)) {
        throw new BadRequestException('Invalid file ID');
      }

      const success = await this.filesService.deleteFile(req.realm, req.tenant, req.team, fileIdNum);

      if (!success) {
        throw new HttpException('File not found or could not be deleted', HttpStatus.NOT_FOUND);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException(
        `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  @Get(':unitId/files/:fileId/download')
  async downloadFile(
    @Param('unitId') unitId: string,
    @Param('fileId') fileId: string,
    @Req() req: RequestWithTenant,
    @Res() res: any,
  ): Promise<void> {
    try {
      const unitIdNum = parseInt(unitId);
      const fileIdNum = parseInt(fileId);

      if (isNaN(unitIdNum)) {
        throw new BadRequestException('Invalid unit ID');
      }

      if (isNaN(fileIdNum)) {
        throw new BadRequestException('Invalid file ID');
      }

      const file = await this.filesService.getFileById(req.realm, req.tenant, req.team, fileIdNum);

      if (!file) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      // For now, return a simple response indicating the file would be downloaded
      // In a real implementation, you would stream the file from storage
      res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${file.original_filename}"`);
      res.status(200).json({
        message: 'File download initiated',
        file: {
          id: file.id,
          name: file.original_filename,
          size: file.size_bytes,
          type: file.mime_type
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error downloading file:', error);
      throw new InternalServerErrorException(
        `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
