node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
npm i
database_url="mysql://dhhost:dbpassword@localhost:3306/dbname"
npx prisma generate
npx prisma migrate dev