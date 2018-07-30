/*
 *  samples/sheets-simple.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-30
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

const assert = require("assert")

const google = require("..")

let credentials
let token

try {
    credentials = require("./credentials.json")
    token = require("./token.json")
} catch (x) {
    console.log("#", "use bin/google-token to get tokens first")
}

_.promise.make({
    googled: {
        credentials: credentials,
    },
    token: token,
})
    .then(google.initialize)
    .then(google.auth.token)
    .then(google.sheets.initialize)
    .then(google.sheets.list_values.p({
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
