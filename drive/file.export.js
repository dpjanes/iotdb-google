/*
 *  drive/file.export.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-09-25
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
const file_export = _.promise((self, done) => {
    _.promise.validate(self, file_export)

    const fs = require("fs")

    self.document_media_type = self.document_media_type || "text/html"

    self.google.drive.files.export({
        fileId: _util.normalize_path(self.path),
        mimeType: self.document_media_type,
    }, {
    }, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                const message = _.d.first(error, "/response/data/error/message", "?")
                return done(new errors.NotFound(
                    `${error.response.status}: ${message} (${self.fileId})`, 
                    error.response.status))
            }

            return done(error)
        }

        self.document = response.data

        done(null, self)
    })
})

file_export.method = "drive.file.file_export"
file_export.requires = {
    path: _util.is_path,
    google: {
        drive: _.is.Object,
    },
}
file_export.accepts = {
    document_media_type: _.is.String,
}
file_export.produces = {
}

/**
 */
const parameterized = (path, document_media_type) => _.promise((self, done) => {
    const google = require("..")

    _.promise(self) 
        .then(google.drive.parse.p(path || self.path || null))
        .add("document_media_type", document_media_type || self.document_media_type || "text/html")
        .then(file_export)
        .end(done, self, "document,document_media_type")
})

/**
 *  API
 */
exports.export = file_export
exports.export.p = parameterized
