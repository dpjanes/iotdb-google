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

const google = require("..")

/**
 */
const _read_token = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(fs.read.json.p(self.paths.token, null))
        .then(_.promise.done(done, self, "json:token"))
        .catch(done)
})

/**
 */
const _write_token = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(fs.write.json.p(self.paths.token, self.token))
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 */
const _request_token_code = _.promise.make((self, done) => {
    const auth_url = self.google.client.generateAuthUrl({
        access_type: "offline",
        scope: self.scopes,
    });

    console.log("Authorize this app by visiting this url:", auth_url);

    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    prompt.question("Enter the code from that page here: ", code => {
        self.code = code

        done(null, self)
    })
})

if (require.main === module) {
    let token = null
    try {
        token = require("./token")
    } catch (x) {
    }

    _.promise.make({
        paths: {
            token: "token.json",
        },
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
        googled: {
            credentials: require("./credentials.json"),
            token: token,
        },
    })
        .then(google.initialize)
        .then(google.token.interactive({
            read: _read_token,
            write: _write_token,
            prompt: _request_token_code,
        }))
        .then(google.sheets.initialize)
        .then(google.sheets.values.p({
            spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            range: "Class Data!A1:E",
        }))
        .then(google.sheets.headers.first)
        .then(_.promise.make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        }))
        .catch(error => {
            delete error.self
            console.log("#", error)
        })
}
