/*
 *  drive/parse_url.js
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
const errors = require("iotdb-errors")

const URL = require("url").URL

/**
 */
const parse_url = _.promise(self => {
    _.promise.validate(self, parse_url)

    const url = new URL(self.url)
    const match = url.pathname.match(/.*\/d\/([^\/]*)/)
    if (!match) {
        return done(new errors.Invalid("did not understand URL"))
    }

    self.fileId = match[1]
})

parse_url.method = "drive.parse_url"
parse_url.requires = {
    url: _.is.String,
}
parse_url.produces = {
    fileId: _.is.String,
}

/**
 */
const parameterized = url => _.promise((self, done) => {
    _.promise(self)
        .add("url", url)
        .then(parse_url)
        .end(done, self, "fileId")
})

/**
 *  API
 */
exports.parse_url = parse_url;
exports.parse_url.p = parameterized
