const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Location of credentials.json
const CREDENTIAL_PATH = `./src/secrets/credentials.json`

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_DIR = './src/secrets';
const TOKEN_PATH = `${TOKEN_DIR}/token.json`;


const authenticate = (code) => {
    return new Promise((resolve, reject) => {
        fs.readFile(CREDENTIAL_PATH, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            let authorized = authorize(JSON.parse(content), code)
            resolve(authorized)
        });
    });
}
const authorize = (credentials, code) => {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

    return new Promise((resolve, reject) => {
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                if (code) {
                    getNewToken(oauth2Client, code).then((res) => {
                        resolve(res);
                    }, (err) => {
                        reject({ err });
                    })
                }
                else {
                    generateAuthUrl(oauth2Client).then((url) => {
                        reject({ err, url });
                    })
                }
            } else {
                oauth2Client.credentials = JSON.parse(token);
                resolve(oauth2Client);
            }
        });
    }).catch((err) => {
        return { auth: undefined, err };
    });
}

const generateAuthUrl = (oauth2Client) => {
    return new Promise((resolve, reject) => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        if (authUrl) {
            resolve(authUrl)
        }
        else {
            let err = `can't generate the auth URL`
            reject(err, authUrl)
        }
    });
}

const getNewToken = (oauth2Client, code) => {
    return new Promise((resolve, reject) => {
        oauth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oauth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) reject(err)//return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                resolve(oauth2Client);
            });
        });
    })
}

module.exports = {
    authenticate
};
