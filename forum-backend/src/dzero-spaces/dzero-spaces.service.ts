import { Injectable } from '@nestjs/common';
import { SpacesConfig } from './dzero-spaces.config';
import { Express } from 'express';
import { S3 } from "aws-sdk";


@Injectable()
export class DzeroSpacesService {
    private readonly s3;
    private readonly bucketName = `${process.env.DIGITALOCEAN_SPACES_NAME}/${process.env.DIGITALOCEAN_SPACES_BUCKET}` || 'your-space-name';

    constructor(private readonly spacesConfig: SpacesConfig) {
        this.s3 = this.spacesConfig.getS3();
    }

    async uploadFile(file: Express.Multer.File, filePath: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
        };

        try {
            const { Location } = await this.s3.upload(params).promise();
            return Location;
        } catch (error) {
            console.error('Error uploading to DigitalOcean Space:', error);
            throw new Error('File upload failed');
        }
    }

    async getFileUrl(filePath: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
            Expires: 60*60,
        };
        try {
            return this.s3.getSignedUrlPromise('getObject', params);
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            throw new Error('Unable to get file URL');
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: filePath,
        };

        try {
            await this.s3.deleteObject(params).promise();
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('File deletion failed');
        }
    }
}
