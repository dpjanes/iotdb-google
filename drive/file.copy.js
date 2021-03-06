/*
 *  drive/file.copy.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-05-16
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
const file_copy = _.promise((self, done) => {
    _.promise.validate(self, file_copy)

    const source = _util.file_only(self.path)
    const destination = _util.file_and_folder(self.destination)

    const resource = {
        name: destination.file,
        parents: [ destination.folder, ],
    };

    self.google.drive.files.copy({
        supportsAllDrives: true,
        resource: resource,
        fileId: source.file,
    }, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                const message = _.d.first(error, "/response/data/error/message", "?")
                return done(new errors.NotFound(
                    `${error.response.status}: ${message} (${self.path})`, 
                    error.response.status))
            }

            return done(error)
        }

        self.google$result = response

        done(null, self)
    })
})

file_copy.method = "drive.file.copy"
file_copy.requires = {
    google: {
        drive: _.is.Object,
    },
    path: _.is.String,
    destination: _.is.String,
}
file_copy.accepts = {
}
file_copy.produces = {
}

/**
 *  API
 */
exports.copy = file_copy
