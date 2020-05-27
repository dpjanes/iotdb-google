/*
 *  bin/google-token.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-30
 *
 *  Copyright (2013-2020) David P. Janes
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

let openurl 
try {
    openurl = require("openurl")
} catch (x) {
}
/**
 */
const _request_token_code = _.promise((self, done) => {
    const auth_url = self.google.client.generateAuthUrl({
        access_type: "offline",
        scope: self.scopes,
    });

    console.log("-", "go to authorization url:", auth_url);
    if (openurl) {
        openurl.open(auth_url)
    }

    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    prompt.question("- enter code: ", code => {
        prompt.close()

        self.code = code

        done(null, self)
    })
})

const minimist = require("minimist")
const ad = minimist(process.argv.slice(2), {
    boolean: [
        "sheets",
        "write",
        "drive",
    ],
    string: [
        "scope",
    ],
    default: {
        token: "./token.json",
        credentials: "./credentials.json",
    }
})

const scopes = []

if (ad.docs) {
    if (ad.write) {
        scopes.push("https://www.googleapis.com/auth/documents")
    } else {
        scopes.push("https://www.googleapis.com/auth/documents.readonly")
    }
}

if (ad.sheets) {
    if (ad.write) {
        scopes.push("https://www.googleapis.com/auth/spreadsheets")
    } else {
        scopes.push("https://www.googleapis.com/auth/spreadsheets.readonly")
    }
}

if (ad.drive) {
    if (ad.write) {
        scopes.push("https://www.googleapis.com/auth/drive")
    } else {
        scopes.push("https://www.googleapis.com/auth/drive.readonly")
    }
}

if (ad.scope) {
    _.coerce.list(ad.scope).forEach(scope => {
        if (_.is.AbsoluteURL(scope)) {
            scopes.push(scope)
        } else {
            scopes.push(`https://www.googleapis.com/auth/${scope}`)
        }
    })
}

const help = message => {
    const name = "google-token"

    if (message) {
        console.log(`${name}: ${message}`)
        console.log()
    }

    console.log("This will get tokens for accessing Google APIs")
    console.log("")
    console.log("Follow the instructions here for getting credentials:")
    console.log("https://developers.google.com/sheets/api/quickstart/nodejs")
    console.log("")

    console.log(`usage: ${name} [options]`)
    console.log("")
    console.log("Options:")
    console.log("--scope <scope>           explicitly request this scope (repeats)")
    console.log("")
    console.log("Service Options:")
    console.log("--sheets                  access Google Sheets (default read-only)")
    console.log("--docs                    access Google Docs (default read-only)")
    console.log("--drive                   access Google Drive (default read-only)")
    console.log("")
    console.log("--write                   request write access also")
    console.log("")
    console.log("Other Options:")
    console.log("--token <file>            change path for token.json")
    console.log("--credentials <file>      change path for credentials.json")

    process.exit(message ? 1 : 0)
}

if (ad.help) {
    help()
}

_.promise({
    scopes: scopes,
    google$cfg: {
        token_path: ad.token,
    },
})
    .then(fs.read.json.p(ad.credentials, null))
    .make(sd => {
        if (!sd.json) {
            help("make sure to get credentials first")
        }

        sd.google$cfg.credentials = sd.json
    })

    // we don't need scopes if renewing
    .then(google.auth.token.read)
    .make(sd => {
        if (sd.google$cfg.token) {
            return
        }
        
        if (!scopes.length) {
            help("no scopes or services set, and no existing token file")
        }
    })

    .then(google.initialize)
    .then(google.auth.interactive({
        prompt: _request_token_code,
    }))
    .make(sd => {
        console.log("+", "done")
    })
    .catch(error => {
        delete error.self
        console.log("#", error)
    })
