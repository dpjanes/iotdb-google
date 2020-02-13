/*
 *  sheets/list_values.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-29
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

/**
 *  Requires: self.google.sheets
 *  Produces: self.jsons, self.google$result
 */
const list_values = _.promise((self, done) => {
    _.promise.validate(self, list_values)

    self.google.sheets.spreadsheets.values.get(self.google$range, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        self.jsons = result.data.values || []
        
        done(null, self)
    })
})

list_values.method = "sheets.list_values";
list_values.requires = {
    google$range: {
        spreadsheetId: _.is.String,
        range: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
list_values.produces = {
    google$result: _.is.Dictionary,
    jsons: _.is.Array,
}


/**
 */
const parameterized = google$range => _.promise((self, done) => {
    const google = require("..")

    _.promise(self)
        .conditional(_.is.String(google$range), google.sheets.parse_path.p(google$range), _.promise.add("google$range", google$range))
        .then(list_values)
        .end(done, self, "jsons,google$result")
})

/**
 *  API
 */
exports.list_values = list_values;
exports.list_values.p = parameterized
