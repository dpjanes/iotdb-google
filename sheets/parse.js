/*
 *  sheets/parse.js
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

/**
 */
const parse = _.promise(self => {
    const google = require("..")

    _.promise(self)
        .validate(parse)
        .add({
            url: self.path,
            range: self.path,
        })
        .conditional(_.is.AbsoluteURL(self.path), google.sheets.parse_url)
        .conditional(self.path.startsWith("/"), google.sheets.parse_path)
        .conditional(self.path.indexOf("/") === -1, google.sheets.parse_range)
        .end(done, self, "query")
})

parse.method = "sheets.parse"
parse.requires = {
    path: _.is.String,
}
parse.produces = {
    query: {
        spreadsheetId: _.is.String,
        range: _.is.String,
    },
}

/**
 */
const parameterized = path => _.promise((self, done) => {
    _.promise(self)
        .add("path", path)
        .then(parse)
        .end(done, self, "query")
})

/**
 *  API
 */
exports.parse = parse;
exports.parse.p = parameterized
