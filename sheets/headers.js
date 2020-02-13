/*
 *  sheets/headers.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-29
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

"use strict";

const _ = require("iotdb-helpers")

/**
 */
const headers = _.promise(self => {
    _.promise.validate(self, headers)

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

headers.method = "sheets.headers"
headers.requires = {
    jsons: _.is.Array,
    headers: _.is.Array,
}
headers.accepts = {
}
headers.produces = {
}

/**
 */
const parameterized = headers => _.promise((self, done) => {
    _.promise(self)
        .add("headers", headers)
        .then(headers)
        .end(done, self, "jsons")
})

/**
 */
const first = _.promise((self, done) => {
    _.promise.validate(self, first)

    if (!self.jsons.length) {
        self.jsons = []
        return done(null, self)
    }

    _.promise(self)
        .add("headers", self.jsons.shift())
        .then(headers)
        .end(done, self, "jsons")
})

first.method = "sheets.headers.first"
first.description = `
    Warning: mutates self.jsons`
first.requires = {
    jsons: _.is.Array,
}
first.accepts = {
}
first.produces = {
    jsons: _.is.Array,
}

/**
 *  API
 */
exports.headers = headers
exports.headers.p = parameterized
exports.headers.first = first
