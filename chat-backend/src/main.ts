import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Serve static files from the public directory
    app.useStaticAssets(join(__dirname, '..', 'public'));
    
    // Set up a fallback route to serve index.html for Angular routes
    app.setGlobalPrefix('api');
    
    app.enableCors({
      origin: ['http://localhost:4200', 'https://angular-chat-liart.vercel.app'], // Updated frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}
bootstrap();
