/*
 *  drive/file.export.js
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
const file_get = _.promise((self, done) => {
    _.promise.validate(self, file_get)

    self.google.drive.files.get({
        fileId: _util.normalize_path(self.path),
        fields: "mimeType,name,size",
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

        self.document_name = response.data.name
        self.document_length = _.coerce.to.Integer(response.data.size, null)
        self.document_media_type = response.data.mimeType

        self.google.drive.files.get({
            fileId: _util.normalize_path(self.path),
            supportsAllDrives: true,
            alt: "media",
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

            self.document = Buffer.from(response.data)

            done(null, self)
        })
    })
})

file_get.method = "drive.file.get"
file_get.description = `
    Use drive.file.metadata to get what Google's
    file.get does. We've made the naming more 
    consistent with IOTDB`
file_get.requires = {
    /*
    path: _util.is_path,
     */
    path: _.is.String,
    google: {
        drive: _.is.Object,
    },
}
file_get.accepts = {
}
file_get.produces = {
    document: _.is.Buffer,
    document_media_type: _.is.String,
    document_name: _.is.String,
    document_length: _.is.Integer,
}
/*
file_get.params = {
    path: _.p.normal,
}
file_get.p = _.p(file_get)
*/

/**
 *  API
 */
exports.get = file_get
