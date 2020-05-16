/*
 *  drive/file.make.directory.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-03-07
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
const file_make_directory = _.promise((self, done) => {
    _.promise.validate(self, file_make_directory)

    const parts = self.path.split("/")
    if (parts.length !== 2) {
        throw new errors.Invalid("expected exactly two path components")
    }

    const resource = {
        name: parts[1],
        parents: [ parts[0] ],
        mimeType: "application/vnd.google-apps.folder",
    };

    self.google.drive.files.create({
        supportsAllDrives: true,
        resource: resource,
        fields: "id",
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

file_make_directory.method = "drive.file.make.directory"
file_make_directory.requires = {
    google: {
        drive: _.is.Object,
    },
    path: _.is.String,
}
file_make_directory.accepts = {
    path: _util.is_path,
}
file_make_directory.produces = {
}

/**
 *  API
 */
exports.directory = file_make_directory
