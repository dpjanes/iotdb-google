# iotdb-google
POP Google wrapper

## Credentials

Google has a two phase process for access to its API
from the command line:

* get a credentials JSON object
* interactively get a Token

More can be read about this
[here](https://developers.google.com/sheets/api/quickstart/nodejs).

When you look at Credentials in the GCM console, you 
should see that it's in the section *OAuth 2.0 client IDs*.

When you download the JSON, it should look something like that,
noting in particular the `installed`.

    {
      "installed": {
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", 
        "auth_uri": "https://accounts.google.com/o/oauth2/auth", 
        "client_id": "XXXX.apps.googleusercontent.com", 
        "client_secret": "XXXX", 
        "project_id": "api-access-XXXX", 
        "redirect_uris": [
          "urn:ietf:wg:oauth:2.0:oob", 
          "http://localhost"
        ], 
        "token_uri": "https://www.googleapis.com/oauth2/v3/token"
      }
    }

To use this you need to also have a token.
We provide a tool here to this, e.g.

    node bin/google-token.js --sheets 

Note the expectation that the credentials are in `credentials.json`
and the token will be saved in `token.json`. 
This is changeable via command line options.

## Google Sheets

See `samples/sheets.js` for a more worked out
version of this sample.

    const _ = require("iotdb-helpers")
    const google = require("iotdb-google")

    _.promise({
        googled: {
            credentials: credentials,   // loaded from somewhere
            token: token,               // loaded from somewhere
        },
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.list_values.p({
            spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            range: "Class Data!A1:E",
        }))
        .then(google.sheets.headers.first)
        .make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        })
        .catch(error => {
            delete error.self
            console.log("#", error)
        })

