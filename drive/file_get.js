/*
 *  drive/file_get.js
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

/**
 */
const get = _.promise((self, done) => {
    _.promise.validate(self, get)

    const fs = require("fs")
    const dest = fs.createWriteStream('/Users/david/xxx.html')

    self.google.drive.files.export({
        fileId: self.fileId,
        mimeType: self.document_media_type || "text/html",
    }, {
        responseType: "stream"
    }, (error, response) => {
        if (error) {
            return done(error)
        }

        response.data
            .on('end', function () {
              console.log('Done');
              done(null, self)
            })
            .on('error', function (err) {
              console.log('Error during download', err);
              done(err)
            })
            .pipe(dest);

        console.log("B")
    })
})

get.method = "drive.file.get"
get.requires = {
    fileId: _.is.String,
    google: {
        drive: _.is.Object,
    },
}
get.accepts = {
    document_media_type: _.is.String,
}
get.produces = {
}

/**
 */
const parameterized = (path, document_media_type) => _.promise((self, done) => {
    const google = require("..")

    _.promise(self) 
        .then(google.drive.parse.p(path || self.path || null))
        .make(sd => {
            console.log("DDD", sd.fileId)
        })
        .add("document_media_type", document_media_type || self.document_media_type || "text/html")
        .then(get)
        .end(done, self)
})

/**
 *  API
 */
exports.get = get
exports.get.p = parameterized
