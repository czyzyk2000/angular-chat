import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: 'http://localhost:4200', // Angular app url
      methods: ['GET', 'POST'],
      credentials: true,
    });

    const port = 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}
bootstrap();
