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
const minimist = require("minimist")

const google = require("..")

let credentials
let token

try {
    credentials = require("./credentials.json")
    token = require("./token.json")
} catch (x) {
    console.log("#", "use bin/google-token to get tokens first")
}


const ad = minimist(process.argv.slice(2));
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return action_name === name
}

const _error = error => {
    delete error.self
    console.log("#", error)
}

const googled = {
    credentials: credentials,
    token: token,
}


if (action("list-values-query")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        // this is public example data
        .then(google.sheets.list_values.p({
            spreadsheetId: "10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE",
            range: "Sheet1!A1:C",
        }))
        .then(google.sheets.headers.first)
        .make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        })
        .catch(_error)
} else if (action("list-path")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        // this is my private data
        .then(google.sheets.list.p("/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/Class Data!A1:E"))
        .then(google.sheets.headers.first)
        .make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        })
        .catch(_error)
} else if (action("list-values-path")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.list_values.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C"))
        .then(google.sheets.headers.first)
        .make(sd => {
            console.log("+", JSON.stringify(sd.jsons, null, 2))
        })
        .catch(_error)
} else if (action("append")) {
    _.promise({
        googled: googled,
        jsons: [ [ "A", "B", 1 ], ]
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C"))
        .then(google.sheets.append)
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("batch.update")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C"))
        .then(google.sheets.batch.update)
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

