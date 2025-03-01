# Angular Chat Application

A real-time chat application built with Angular, NestJS, Socket.io, and Supabase.

## Project Structure

- `chat-frontend`: Angular frontend application
- `chat-backend`: NestJS backend application with Prisma and Supabase

## Features

- Real-time messaging using Socket.io
- User authentication
- Message history
- Responsive design

## Deployment

This application is deployed on Vercel:
- Frontend: https://angular-chat-czyzyk2000.vercel.app
- Backend: https://angular-chat-backend-czyzyk2000.vercel.app

## Local Development

### Backend

```bash
cd chat-backend
npm install
npm run start:dev
```

### Frontend

```bash
cd chat-frontend
npm install
ng serve
```

## Environment Variables

### Backend (.env)

```
DATABASE_URL="postgresql://postgres.kxlppjevzenjvuqwqmaf:postgress@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.kxlppjevzenjvuqwqmaf:postgress@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## License

MIT
