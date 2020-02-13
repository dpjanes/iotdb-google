/*
 *  sheets/list.js
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
const list = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, list)

    _.promise(self)
        .validate(list)

        .add("jsons", null)
        .conditional(self.google$range.spreadsheetId && self.google$range.range, google.sheets.list_values)
        .make(sd => {
            if (sd.jsons) {
                return
            }

            throw new errors.Invalid("can't find a listing function for the google$range")
        })

        .end(done, self, "jsons")
})

list.method = "sheets.list";
list.requires = {
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
list.accepts = {
    google$range: {
        range: _.is.String,
    },
}
list.produces = {
    google$result: _.is.Dictionary,
    jsons: _.is.Array,
}


/**
 */
const parameterized = google$range => _.promise((self, done) => {
    const google = require("..")

    _.promise(self)
        .conditional(_.is.String(google$range), google.sheets.parse.p(google$range), _.promise.add("google$range", google$range))
        .then(list)
        .end(done, self, "jsons,google$result")
})

/**
 *  API
 */
exports.list = list;
exports.list.p = parameterized
