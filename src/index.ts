import Express, { Request, Response } from 'express';
import { google } from 'googleapis';
import { parse } from 'url';

const app = Express();
const PORT = 3000;

const oauth2Client = new google.auth.OAuth2(
  '955515081262-hivfh47m590jrrvd8itdms3gdopf98m6.apps.googleusercontent.com',
  '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',
  'http://ec2-35-78-83-135.ap-northeast-1.compute.amazonaws.com:3000/oauth2callback',
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

/* Global variable that stores user credential in this code example.
 * ACTION ITEM for developers:
 *   Store user's refresh token in your data store if
 *   incorporating this code into your real app.
 *   For more information on handling refresh tokens,
 *   see https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
 */
let userCredential = null;

app.get('/', (req: Request, res: Response) => {
  console.log('/');

  res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>CLIENT</title>
    </head>
    <body>
      <a href="http://35.78.83.135:3000/login">login</a>
    </body>
  </html>`);
});

app.get('/login', (req, res) => {
  res.writeHead(301, { Location: authorizationUrl }).end();
  // res.redirect(authorizationUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const q = parse(req.url, true).query;

  // TODO(cattus-cur): q to string

  const { tokens } = await oauth2Client.getToken(q.code as string);

  oauth2Client.setCredentials(tokens);

  console.log({ tokens });

  // Example of using Google Drive API to list filenames in user's Drive.
  // const drive = google.drive('v3');

  // drive.files.list(
  //   {
  //     auth: oauth2Client,
  //     pageSize: 10,
  //     fields: 'nextPageToken, files(id, name)',
  //   },
  //   (err1, res1) => {
  //     if (err1) return console.log('The API returned an error: ' + err1);
  //     const files = res1.data.files;

  //     if (files.length) {
  //       console.log('Files:');
  //       files.map((file) => {
  //         console.log(`${file.name} (${file.id})`);
  //       });
  //     } else {
  //       console.log('No files found.');
  //     }

  //   },
  // );

  res.send(200);
});

app.get('/revoke', (req, res) => {
  console.log('revoke');
  // // Build the string for the POST request
  // let postData = 'token=' + userCredential?.access_token;

  // // Options for POST request to Google's OAuth 2.0 server to revoke a token
  // let postOptions = {
  //   host: 'oauth2.googleapis.com',
  //   port: '443',
  //   path: '/revoke',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Content-Length': Buffer.byteLength(postData),
  //   },
  // };

  // // Set up the request
  // const postReq = https.request(postOptions, function (res) {
  //   res.setEncoding('utf8');
  //   res.on('data', (d) => {
  //     console.log('Response: ' + d);
  //   });
  // });

  // postReq.on('error', (error: any) => {
  //   console.log(error);
  // });

  // // Post the request with data
  // postReq.write(postData);
  // postReq.end();

  res.send(200);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
