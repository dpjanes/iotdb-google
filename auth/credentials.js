/*
 *  auth/credentials.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-11-26
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
const fs = require("iotdb-fs")

/**
 */
const credentials_read = _.promise((self, done) => {
    _.promise(self)
        .then(fs.read.json.p(self.googled.credentials_path, null))
        .end(done, self, "json:googled/credentials")
})

credentials_read.method = "auth.credentials.read"
credentials_read.requires = {
    googled: {
        credentials_path: _.is.String,
    },
}

/**
 */
const credentials_write = _.promise((self, done) => {
    _.promise(self)
        .then(fs.write.json.p(self.googled.credentials_path, self.googled.credentials))
        .end(done, self)
})

credentials_write.method = "auth.credentials.write"
credentials_write.requires = {
    googled: {
        credentials_path: _.is.String,
        credentials: _.is.Dictionary,
    },
}

/**
 *  API
 */
exports.credentials = {}
exports.credentials.read = credentials_read;
exports.credentials.write = credentials_write;
