/*
 *  samples/sheets.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-30
 *
 *  Copyright [2013-2019] [David P. Janes]
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
    if (error.errors) {
        console.log("#", error.errors)
    } else {
        console.log("#", error)
    }
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
} else if (action("find_replace_regex")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A"))
        .then(google.sheets.find_replace.p(/J.*$/, "JJJJ"))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("properties")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.properties)
        .make(sd => {
            console.log("+", "done", JSON.stringify(sd.properties, null, 2))
        })
        .catch(_error)
} else if (action("sheets")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.sheets)
        .make(sd => {
            console.log("+", "done", JSON.stringify(sd.sheets, null, 2))
        })
        .catch(_error)
} else if (action("parse")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_url.p(
            "https://docs.google.com/spreadsheets/d/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/edit#gid=0"))
        .then(google.sheets.parse_range.p("A1:A7"))
        .then(google.sheets.find_replace.p("Joe", "Joseph"))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("title.set")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.title.set.p("Hello, World"))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("title.get")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.title.get)
        .make(sd => {
            console.log("+", "done", sd.title)
        })
        .catch(_error)
} else if (action("cell.background")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.cell.background.p(_.random.choose(_.values(_.color.colord))))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("cell.color")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.cell.color.p(_.random.choose(_.values(_.color.colord))))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("style")) {
    _.promise({
        googled: googled,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.sheets.initialize)
        .then(google.sheets.parse_path.p("/10Wdg2EE6TGEnOBJonFuQ5C9Kp0cZy1Lp0zA4JsSIniE/Sheet1/A1:C1"))
        .then(google.sheets.cell.bold.p(true))
        // .then(google.sheets.cell.italic.p(true))
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

