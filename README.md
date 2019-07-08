# iotdb-google
Pipe-Oriented Programming Google wrapper

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

    let credentials
    let token

    try {
        credentials = require("./credentials.json")
        token = require("./token.json")
    } catch (x) {
        console.log("#", "use bin/google-token to get tokens first")
    }

    _.promise({
        googled: {
            credentials: credentials,   // loaded from somewhere
            token: token,               // loaded from somewhere
        },
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)

        .then(google.sheets.list.p("/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/Class Data!A1:E"))
        .then(google.sheets.headers.first)

        .make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        })
        .catch(error => {
            delete error.self
            console.log("#", error)
        })

Here's an example of manipulating the spreadsheet

    _.promise({
        googled: {
            credentials: credentials,   // loaded from somewhere
            token: token,               // loaded from somewhere
        },
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE"))

        .add("google$batch", true)

        // change the header
        .then(google.sheets.parse.p("Sheet1!A1:F1"))
        .then(google.sheets.cell.underline.p(true))
        .then(google.sheets.cell.background.p(_.random.choose(_.values(_.color.colord))))
        .then(google.sheets.cell.color.p(_.random.choose(_.values(_.color.colord))))

        // manipulate the first row
        .then(google.sheets.parse_range.p("A1:A7"))
        .then(google.sheets.find_replace.p(/^J.*$/, "Joseph"))

        // do all those commands at once (uses "google$batch")
        .then(google.sheets.batch)

        .make(sd => {
            console.log("+", "done")
        })
        .catch(error => {
            delete error.self
            console.log("#", error)
        })
