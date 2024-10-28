## setup

npm i
npx prisma generate
npx prisma migrate dev

## env

```bash
DATABASE_URL="mysql://dhhost:dbpassword@localhost:3306/dbname"
JWT_SECRET=node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
CLOUDFLARE_IMAGE_URL_PREFIX=https://<cloudflare-domain>/<bucket-name>/
```