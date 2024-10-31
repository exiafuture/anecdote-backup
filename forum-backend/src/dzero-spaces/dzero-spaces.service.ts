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
}
