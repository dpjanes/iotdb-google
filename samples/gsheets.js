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


if (require.main === module) {
    let token = null
    try {
        token = require("./token")
    } catch (x) {
    }

    _.promise.make({
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets.readonly",
        ],
        googled: {
            credentials: require("./credentials.json"),
            token: token,
        },
    })
        .then(google.initialize)
        .then(google.token.set)
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
