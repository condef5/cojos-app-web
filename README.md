# Cojos app

<img src='https://i.imgur.com/0QZVfYx.png' />

## Setup development

1. You need these programs:

- [NodeJs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Sqlite](https://www.sqlite.org/index.html)

2. Add the `.env` file

```sh
cp .env.example .env
```

3. Create database file

```
touch prisma/data.db
```

4. Run migrations

```sh
yarn prisma migrate dev
```

5. Run the seeds

```sh
yarn prisma db seed
```

6. Start dev server:

```sh
yarn dev
```

7. Go to http://localhost:3000/

8. Use these credentials:

- Email: `frankcondezo@gmail.com`
- Password: `letmein`
