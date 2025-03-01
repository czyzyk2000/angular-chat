import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Check if public directory exists
    const publicPath = join(__dirname, '..', 'public');
    if (fs.existsSync(publicPath)) {
      console.log('Public directory exists, serving static files from:', publicPath);
      app.useStaticAssets(publicPath);
    } else {
      console.log('Public directory does not exist at:', publicPath);
      // Create the public directory if it doesn't exist
      fs.mkdirSync(publicPath, { recursive: true });
      console.log('Created public directory at:', publicPath);
    }
    
    // Set up API routes with prefix
    app.setGlobalPrefix('api', { exclude: [''] });
    
    app.enableCors({
      origin: ['http://localhost:4200', 'https://angular-chat-liart.vercel.app', 'https://angular-chat-rho.vercel.app'], 
      methods: ['GET', 'POST'],
      credentials: true,
    });

    // Add a catch-all route to serve index.html for Angular routes
    app.use('*', (req, res, next) => {
      const indexPath = join(publicPath, 'index.html');
      if (fs.existsSync(indexPath) && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
        res.sendFile(indexPath);
      } else {
        next();
      }
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

bootstrap();
