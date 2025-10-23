import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { FileService, FileResponse } from '@fortuna/content';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FilesService {
  private fileService: FileService;

  constructor(@Inject(DatabaseService) private readonly databaseService: DatabaseService) {
    this.fileService = new FileService(this.databaseService);
  }

  async createFileWithOcrAndChunks(
    realm: string,
    tenant: string,
    teamId: string,
    unitId: number,
    fileData: any,
    fileBuffer: Buffer,
    chunkSize: number = 1000,
    chunkOverlap: number = 250,
    authHeaders?: { authorization?: string; 'x-tenant'?: string },
    mimeType?: string
  ): Promise<FileResponse> {
    try {
      const fileService = new FileService(this.databaseService);
      return await fileService.createFileWithBackgroundProcessing(
        realm,
        tenant,
        teamId,
        unitId,
        fileData,
        fileBuffer,
        chunkSize,
        chunkOverlap,
        authHeaders,
        mimeType
      );
    } catch (error) {
      console.error('Database error creating file with OCR and chunks:', error);
      throw new HttpException('Failed to create file with OCR processing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFilesByUnit(realm: string, tenant: string, teamId: string, unitId: number): Promise<FileResponse[]> {
    try {
      const fileService = new FileService(this.databaseService);
      return await fileService.getFilesByUnit(realm, tenant, teamId, unitId);
    } catch (error) {
      console.error('Database error fetching files:', error);
      throw new HttpException('Failed to fetch files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFileById(realm: string, tenant: string, teamId: string, fileId: number): Promise<FileResponse | null> {
    try {
      const fileService = new FileService(this.databaseService);
      return await fileService.getFileById(realm, tenant, teamId, fileId);
    } catch (error) {
      console.error('Database error fetching file:', error);
      throw new HttpException('Failed to fetch file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(realm: string, tenant: string, teamId: string, fileId: number): Promise<boolean> {
    try {
      const fileService = new FileService(this.databaseService);
      return await fileService.deleteFile(realm, tenant, teamId, fileId);
    } catch (error) {
      console.error('Database error deleting file:', error);
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
