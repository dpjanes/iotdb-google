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

const google = require("googleapis").google

const PATH_CREDENTIALS = "credentials.json"
const PATH_TOKEN = "token.json"

/**
 *  This will read the credentials and make
 *  an OAuth2 client
 */
const _create_client = _.promise.make((self, done) => {
    assert.ok(self.paths)
    assert.ok(_.is.String(self.paths.credentials))

    _.promise.make(self)
        .then(fs.read.json.p(PATH_CREDENTIALS))
        .then(_.promise.make(sd => {
            sd.credentials = sd.json.installed
            sd.client = new google.auth.OAuth2(
                sd.credentials.client_id, 
                sd.credentials.client_secret, 
                sd.credentials.redirect_uris[0]
            )
        }))
        .then(_.promise.done(done, self, "client"))
        .catch(done)
})

/**
 *  Read or fetch a token
 */
const _get_token = _.promise.make((self, done) => {
    assert.ok(self.client)
    assert.ok(self.paths)
    assert.ok(_.is.String(self.paths.token))

    _.promise.make(self)
        .then(fs.read.json.p(PATH_TOKEN, null))
        .then(_.promise.done(done, self, "json:token"))
        .catch(done)
})

/**
 *  Finish setting up OAuth2 client. Note the 
 *  slight Google namespacing issue with the 
 *  word "credentials"
 */
const _set_client_token = _.promise.make(self => {
    assert.ok(self.client)
    assert.ok(self.token)

    self.client.setCredentials(self.token)
})

/**
 *  This connects to Google Sheets using the client
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
 *  Demonstrate how to connect to Sheets using the POP way
 *  
 *  Original horrible way here:
 *  https://developers.google.com/sheets/api/quickstart/nodejs
 */
if (require.main === module) {
    _.promise.make({
        paths: {
            credentials: "credentials.json",
            token: "token.json",
        },
    })
        .then(_create_client)
        .then(_get_token)
        .then(_set_client_token)
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
