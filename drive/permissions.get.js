/*
 *  drive/permissions.get.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-03-08
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

"use strict"

const _ = require("iotdb-helpers")
const errors = require("iotdb-errors")

const _util = require("./_util")

/**
 */
const permissions_get = _.promise((self, done) => {
    _.promise.validate(self, permissions_get)

    self.google.drive.permissions.list({
        fileId: _util.normalize_path(self.path),
        supportsAllDrives: true,
    }, {}, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                const message = _.d.first(error, "/response/data/error/message", "?")
                return done(new errors.NotFound(
                    `${error.response.status}: ${message} (${self.fileId})`, 
                    error.response.status))
            }

            return done(error)
        }

        console.log("HERE:XXX", response.data)

        done(null, self)
    })
})

permissions_get.method = "drive.permissions.get"
permissions_get.description = ``
permissions_get.requires = {
    path: _util.is_path,
    google: {
        drive: _.is.Object,
    },
}
permissions_get.accepts = {
}
permissions_get.produces = {
}
permissions_get.params = {
    path: _.p.normal,
}
permissions_get.p = _.p(permissions_get)

/**
 *  API
 */
exports.get = permissions_get
