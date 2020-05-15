/*
 *  drive/drive.list.js
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

/**
 */
const drive_list = _.promise((self, done) => {
    _.promise.validate(self, drive_list)

    const paramd = {
        pageSize: 100,
    }
    if (self.pager) {
        paramd.pageToken = self.pager
    }

    self.google.drive.drives.list(paramd, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                return done(new errors.NotFound(
                    `${error.response.status}: ${error.response.statusText || "?"} (${self.fileId})`, 
                    error.response.status))
            }

            return done(error)
        }

        self.paths = response.data.drives
        self.google$result = response
        self.cursor = {
            has_next: !!response.data.nextPageToken,
            next: response.data.nextPageToken || null,
        }

        done(null, self)
    })
})

drive_list.method = "drive.file.drive_list"
drive_list.requires = {
    google: {
        drive: _.is.Object,
    },
}
drive_list.accepts = {
    pager: _.is.String,
}
drive_list.produces = {
    paths: _.is.Array.of.Dictionary,
    google$result: _.is.Object,
    cursor: _.is.Dictionary,
}

/**
 *  API
 */
exports.list = drive_list
