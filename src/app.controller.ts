import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { google } from 'googleapis';
import { Request, Response } from 'express';
import { parse } from 'url';

@Controller()
export class AppController {
  private authorizationUrl = '';
  private oauth2Client = null;

  constructor(private readonly appService: AppService) {
    /**
     * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
     * from the client_secret.json file. To get these credentials for your application, visit
     * https://console.cloud.google.com/apis/credentials.
     */
    this.oauth2Client = new google.auth.OAuth2(
      '955515081262-hivfh47m590jrrvd8itdms3gdopf98m6.apps.googleusercontent.com',
      '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',
      'localhost:3000',
    );

    // Access scopes for read-only Drive activity.
    const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

    // Generate a url that asks permissions for the Drive activity scope
    this.authorizationUrl = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/login')
  login(@Req() request: Request, @Res() response: Response): void {
    console.log(this.authorizationUrl);

    response.writeHead(301, { Location: this.authorizationUrl });
    response.redirect(this.authorizationUrl);
  }

  @Get('/oauth2callback')
  async oauth2callback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const q = parse(request.url, true).query;

    console.log({ q });

    const { tokens } = await this.oauth2Client.getToken(q.code);

    this.oauth2Client.setCredentials(tokens);

    console.log({ tokens });
  }

  @Get('/revoke')
  revoke(): number {
    console.log('revoke');

    return 200;
  }
}
