import Express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { parse } from 'url';

const app = Express();
const PORT = 3000;

const oauth2Client = new google.auth.OAuth2(
  '955515081262-hivfh47m590jrrvd8itdms3gdopf98m6.apps.googleusercontent.com',
  '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',
  'localhost:3000',
);

// Access scopes for read-only Drive activity.
const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

// Generate a url that asks permissions for the Drive activity scope
const authorizationUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  /** Pass in the scopes array defined above.
   * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
  scope: scopes,
  // Enable incremental authorization. Recommended as a best practice.
  include_granted_scopes: true,
});

app.get('/', (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>CLIENT</title>
    </head>
    <body>
      <a href="http://localhost:3000/login">login</a>
    </body>
  </html>`);
});

app.get('/login', (req, res) => {
  res.writeHead(301, { Location: authorizationUrl });
  res.redirect(authorizationUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const q = parse(req.url, true).query;

  // TODO(cattus-cur): q to string

  const { tokens } = await oauth2Client.getToken(q.code as string);

  oauth2Client.setCredentials(tokens);

  console.log({ tokens });
});

app.get('/revoke', (req, res) => {
  console.log('revoke');

  return 200;
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
