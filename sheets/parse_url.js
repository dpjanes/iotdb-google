/*
 *  sheets/parse_url.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-05
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
const errors = require("iotdb-errors")

const URL = require("url").URL

/**
 */
const parse_url = _.promise(self => {
    _.promise.validate(self, parse_url)

    self.google$range = {
        spreadsheetId: null,
        range: null,
    }

    const url = new URL(self.url)
    const match = url.pathname.match(/.*\/d\/([^\/]*)/)
    if (!match) {
        return done(new errors.Invalid("did not understand URL"))
    }

    self.google$range.spreadsheetId = match[1]
})

parse_url.method = "sheets.parse_url"
parse_url.requires = {
    url: _.is.String,
}
parse_url.produces = {
    google$range: {
        spreadsheetId: _.is.String,
    },
}
parse_url.params = {
    url: _.p.normal,
}
parse_url.p = _.p(parse_url)

/**
 *  API
 */
exports.parse_url = parse_url
