/*
 *  drive/file.list.js
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
const file_list = _.promise((self, done) => {
    _.promise.validate(self, file_list)

    const query = {}
    if (self.path) {
        query.driveId = _util.normalize_path(self.path)
        query.corpora = "drive"
        query.includeItemsFromAllDrives = true
        query.supportsAllDrives = true
    }

    self.google.drive.files.list(query, {}, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                const message = _.d.first(error, "/response/data/error/message", "?")
                return done(new errors.NotFound(
                    `${error.response.status}: ${message} (${self.path})`, 
                    error.response.status))
            }

            return done(error)
        }

        self.paths = response.data.files
        self.google$result = response
        self.cursor = {
            has_next: !!response.nextPageToken,
            next: response.nextPageToken || null,
        }

        done(null, self)
    })
})

file_list.method = "drive.file.file_list"
file_list.requires = {
    google: {
        drive: _.is.Object,
    },
}
file_list.accepts = {
    path: _util.is_path,
}
file_list.produces = {
}

/**
 *  API
 */
exports.list = file_list
