/*
 *  samples/drive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-09-25
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
    credentials = require("../.cfg/credentials.json")
    token = require("../.cfg/token.json")
} catch (x) {
    console.log("#", "use bin/google-token to get tokens first")
    process.exit(1)
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

const google$cfg = {
    credentials: credentials,
    token: token,
}


if (action("parse.url")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("https://docs.google.com/document/d/165UMz9PFdulLo1vqJwrRhul5WI2NvZcRSAOkGFN6VIs/edit"))
        .make(sd => {
            console.log("+", sd.path)
        })
        .catch(_error)
} else if (action("parse.path")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        // .then(google.drive.parse.p("0ADfGktgHOUEPUk9PVA/Data/demo-bar"))
        // .then(google.drive.parse.p("0ADfGktgHOUEPUk9PVA/XXX"))
        .then(google.drive.parse.p("/Walkup/Data/demo-bar"))
        .make(sd => {
            console.log("+", sd.path)
        })
        .catch(_error)
} else if (action("file.export")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("https://docs.google.com/document/d/165UMz9PFdulLo1vqJwrRhul5WI2NvZcRSAOkGFN6VIs/edit"))
        .then(google.drive.file.export)
        .make(sd => {
            console.log("+", sd.document)
        })
        .catch(_error)
} else if (action("file.get")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("1NPIuMTkz0nhx35jRyjvBGcGaycLuPANF"))
        .then(google.drive.file.get)
        .make(sd => {
            console.log("+", sd.document_name, sd.document_media_type, sd.document_length)
            console.log("+", sd.document)
        })
        .catch(_error)
} else if (action("file.list")) {
    _.promise({
        google$cfg: google$cfg,
        // path: "0ABWKoEjGzmq2Uk9PVA",
        // path: "0ADfGktgHOUEPUk9PVA/Data/demo-bar",
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("/Walkup/Data/demo-bar"))
        .then(google.drive.file.list)
        .make(sd => {
            console.log("+", sd.paths)
        })
        .catch(_error)
} else if (action("file.make.directory")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("/Walkup/Data/" + _.timestamp.make()))
        .then(google.drive.file.make.directory)
        .make(sd => {
            console.log("+", "done")
        })
        .catch(_error)
} else if (action("drive.list")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.drive.list)
        .make(sd => {
            sd.paths.sort((a, b) => _.is.unsorted(a.name, b.name))
            sd.paths.forEach(path => {
                console.log("+", path.id, path.name)
            })

            if (sd.cursor) {
                console.log()
                console.log("+", sd.cursor)
            }
        })
        .catch(_error)
} else if (action("drive.list.page")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .page({
            batch: google.drive.drive.list,
            outputs: "paths",
            output_selector: sd => sd.paths,
        })
        .make(sd => {
            sd.paths.sort((a, b) => _.is.unsorted(a.name, b.name))
            sd.paths.forEach(path => {
                console.log("+", path.id, path.name)
            })
        })
        .catch(_error)
} else if (action("permissions.get")) {
    _.promise({
        google$cfg: google$cfg,
    })
        .then(google.initialize)
        .then(google.auth.token)
        .then(google.drive.initialize)
        .then(google.drive.parse.p("/Walkup/Data/demo-bar"))
        .then(google.drive.permissions.get)
        .make(sd => {
            console.log("+", sd.document_name, sd.document_media_type, sd.document_length)
            console.log("+", sd.document)
        })
        .catch(_error)
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

