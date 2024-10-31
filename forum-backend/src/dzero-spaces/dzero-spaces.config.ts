import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpacesConfig {
    private readonly s3: S3;

    constructor() {
        this.s3 = new S3({
            endpoint: process.env.DIGITALOCEAN_SPACES_ENDPOINT, 
            accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY,
            secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET_KEY,
            region: process.env.DIGITALOCEAN_SPACES_REGION,  
        });
    }

    getS3() {
        return this.s3;
    }
}
