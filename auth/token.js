/*
 *  auth/token.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-28
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

const google = require("googleapis")

/**
 *  Sets credentials based on token
 */
const token = _.promise(self => {
    _.promise.validate(self, token)

    self.google.client.setCredentials(self.googled.token)
})

token.method = "auth.token"
token.requires = {
    google: {
        client: _.is.Object,
    },
    googled: {
        token: _.is.Dictionary,
    },
}

/**
 */
const token_read = _.promise((self, done) => {
    _.promise(self)
        .then(fs.read.json.p(self.googled.token_path, null))
        .end(done, self, "json:googled/token")
})

token_read.method = "auth.token.read"
token_read.requires = {
    googled: {
        token_path: _.is.String,
    },
}

/**
 */
const token_write = _.promise((self, done) => {
    _.promise(self)
        .then(fs.write.json.p(self.googled.token_path, self.googled.token))
        .end(done, self)
})

token_write.method = "auth.token.write"
token_write.requires = {
    googled: {
        token_path: _.is.String,
        token: _.is.Dictionary,
    },
}

/**
 *  API
 */
exports.token = token;
exports.token.read = token_read;
exports.token.write = token_write;
