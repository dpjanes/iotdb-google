/*
 *  sheets/parse_path.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-01-30
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
const parse_path = _.promise(self => {
    _.promise.validate(self, parse_path)

    const parts = self.path.split("/").filter(p => p.length)

    self.query = {}

    switch (parts.length) {
    case 0:
        return done(new errors.Invalid("expected at least one path components"))

    case 1:
        self.query.spreadsheetId = parts[0]
        break

    case 2:
        self.query.spreadsheetId = parts[0]
        self.query.range = parts[1]
        break

    case 3:
        self.query.spreadsheetId = parts[0]
        self.query.range = `${parts[1]}!${parts[2]}`
        break

    default:
        return done(new errors.Invalid("too many path components"))
    }
})

parse_path.method = "sheets.parse_path"
parse_path.requires = {
    path: _.is.String,
}
parse_path.produces = {
    query: {
        spreadsheetId: _.is.String,
        range: [ _.is.String, _.is.Nullish ],
    },
}


/**
 */
const parameterized = path => _.promise((self, done) => {
    _.promise(self)
        .add("path", path)
        .then(parse_path)
        .end(done, self, "query")
})

/**
 *  API
 */
exports.parse_path = parse_path;
exports.parse_path.p = parameterized
