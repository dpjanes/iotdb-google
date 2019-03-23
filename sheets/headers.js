/*
 *  sheets/headers.js
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

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

/**
 *  Requires: self.jsons, self.headers
 *  Produces: self.jsons
 */
const headers = _.promise.make(self => {
    const method = "sheets.headers";

    assert.ok(_.is.Array(self.jsons), `${method}: expected self.jsons to be Array`)
    assert.ok(_.is.Array(self.headers), `${method}: expected self.headers to be Array`)

    self.jsons = self.jsons
        .map(row => _.object(self.headers, row))
        .map(row => {
            _.mapObject(row, (value, key) => {
                if (_.is.Undefined(value)) {
                    delete row[key]
                }
            })
            return row
        })
})

/**
 */
const parameterized = _headers => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("headers", _headers))
        .then(headers)
        .then(_.promise.done(done, self, "jsons"))
        .catch(done)
})

/**
 */
const first = _.promise.make((self, done) => {
    const method = "sheets.headers.first";

    assert.ok(_.is.Array(self.jsons), `${method}: expected self.jsons to be Array`)

    if (!self.jsons.length) {
        self.jsons = []
        return done(null, self)
    }

    const _headers = self.jsons.shift()
    
    _.promise.make(self)
        .then(_.promise.add("headers", _headers))
        .then(headers)
        .then(_.promise.done(done, self, "jsons"))
        .catch(done)
})

/**
 *  API
 */
exports.headers = headers
exports.headers.p = parameterized
exports.headers.first = first
