## setup

npm i
npx prisma generate
npx prisma migrate dev

## env

```bash
DATABASE_URL="mysql://dhhost:dbpassword@localhost:3306/dbname"
JWT_SECRET=node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

## prisma query

```code
+------------+-----+
| subforumId | id  |
+------------+-----+
|          5 |  96 |
|          5 |  99 |
|          5 | 100 |
|          6 | 101 |
|          6 | 102 |
|          6 | 103 |
|          6 | 104 |
|          6 | 105 |
|          6 | 106 |
|          6 | 107 |
|          6 | 108 |
|          6 | 110 |
|          7 | 111 |
|          7 | 113 |
|          7 | 116 |
|          8 | 118 |
|          8 | 120 |
|          8 | 121 |
|          8 | 122 |
|          9 | 123 |
|          9 | 124 |
|          9 | 126 |
|          9 | 127 |
|          9 | 128 |
|          9 | 129 |
|          9 | 130 |
|         10 | 131 |
|         10 | 132 |
+------------+-----+
```