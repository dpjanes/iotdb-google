/*
 *  samples/sheets.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-28
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")
const readline = require("readline")

const google = require("googleapis").google

/**
 *  This will read the credentials and make an OAuth2 client
 *
 *  Requires: self.paths.credentials
 *  Produces: self.client
 */
const _create_client = _.promise.make((self, done) => {
    assert.ok(self.paths)
    assert.ok(_.is.String(self.paths.credentials))

    _.promise.make(self)
        .then(fs.read.json.p(self.paths.credentials))
        .then(_.promise.make(sd => {
            const credentials = sd.json.installed

            sd.client = new google.auth.OAuth2(
                credentials.client_id, 
                credentials.client_secret, 
                credentials.redirect_uris[0]
            )
        }))
        .then(_.promise.done(done, self, "client"))
        .catch(done)
})

/**
 *  This will prompt a user to go to Google for a code
 *  that will allow a token to be retieved.
 *
 *  When the token is retrieved, it will be writen 
 *  to the tokens file.
 *
 *  Of all the the code here, this is the ugliest because
 *  we'd probably separate out the writing code, and
 *  use "token" rather than "json" as the return variable,
 *  but it's OK here
 *
 *  Requires: self.client, self.scopes, self.paths.token
 *  Produces: self.json
 */
const _interactive_token_request = _.promise.make((self, done) => {
    assert.ok(self.client)
    assert.ok(self.scopes)
    assert.ok(self.paths.token)

    const auth_url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: self.scopes,
    });

    console.log("Authorize this app by visiting this url:", auth_url);

    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    prompt.question("Enter the code from that page here: ", code => {
        prompt.close()

        self.client.getToken(code, (error, token) => {
            if (error) {
                return done(error)
            }

            _.promise.make(self)
                .then(_.promise.add({
                    json: token,
                    path: self.paths.token,
                }))
                .then(fs.write.json)
                .then(_.promise.log("wrote token", "path"))
                .then(_.promise.done(done, self, "json"))
                .catch(done)
        })
    })
});

/**
 *  Read or fetch a token and add to the OAuth2 client.
 *
 *  Requires: self.client, self.paths.token
 *  Produces: N/A
 */
const _attach_token = _.promise.make((self, done) => {
    assert.ok(self.client)
    assert.ok(self.paths)
    assert.ok(_.is.String(self.paths.token))

    _.promise.make(self)
        .then(fs.read.json.p(self.paths.token, null))
        .then(_.promise.conditional(sd => !sd.json, _interactive_token_request))
        .then(_.promise.make(sd => {
            sd.client.setCredentials(sd.json)
        }))
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  This connects to Google Sheets using the client
 *
 *  Requires: self.client
 *  Produces: self.sheets
 */
const _connect_to_sheets = _.promise.make(self => {
    assert.ok(self.client)

    self.sheets = google.sheets({
        version: "v4", 
        auth: self.client
    });
})

/**
 *  This will list the majors from a spreadsheet
 *
 *  Requires: self.sheets
 *  Produces: self.jsons
 */
const _list_majors = _.promise.make((self, done) => {
    assert.ok(self.sheets)

    const SPREADSHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

    self.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Class Data!A2:E",
    }, (error, result) => {
        if (error) {
            return done(error)
        }

        self.jsons = result.data.values
            .map(row => _.object([ "name", "gender", "year", "state", "major" ], row))

        done(null, self)
    })
})

/**
 *  Demonstrate how to connect to Sheets using the POP way.
 *  Note however this doesn't use the iotdb-sheets library,
 *  which makes this even easier
 *  
 *  Original horrible way here:
 *  https://github.com/gsuitedevs/node-samples/blob/master/sheets/quickstart/index.js
 *
 *  Basically follow setup instructions here:
 *  https://developers.google.com/sheets/api/quickstart/nodejs
 */
if (require.main === module) {
    _.promise.make({
        paths: {
            credentials: "credentials.json",
            token: "token.json",
        },
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
    })
        .then(_create_client)
        .then(_attach_token)
        .then(_connect_to_sheets)
        .then(_list_majors)
        .then(_.promise.make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        }))
        .catch(error => {
            delete error.self
            console.log("#", error)
        })
}
