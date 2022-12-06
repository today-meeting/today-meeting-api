import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>CLIENT</title>
      </head>
      <body>
        <a href="http://localhost:3000/login">login</a>
      </body>
    </html>`;
  }
}
