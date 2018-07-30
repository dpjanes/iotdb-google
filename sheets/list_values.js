/*
 *  sheets/list_values.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-29
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

/**
 *  Requires: self.google.sheets
 *  Produces: self.jsons, self.google_result
 */
const list_values = _.promise.make((self, done) => {
    const method = "sheets.list_values";

    assert.ok(self.query, `${method}: expected self.query`)
    assert.ok(self.google, `${method}: expected self.google`)
    assert.ok(self.google.sheets, `${method}: expected self.google.sheets`)

    self.google.sheets.spreadsheets.values.get(self.query, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google_result = result
        self.jsons = result.data.values
        
        done(null, self)
    })

})

/**
 */
const parameterized = query => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("query", query))
        .then(list_values)
        .then(_.promise.done(done, self, "jsons,google_result"))
        .catch(done)
})

/**
 *  API
 */
exports.list_values = list_values;
exports.list_values.p = parameterized
