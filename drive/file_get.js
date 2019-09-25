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
    const doc = "1vgWWtt4JEyNiGVGTs9tcOfRdZcg9UJGbIDWGNYpR0kc"
    const alt = "html"

    const fs = require("fs")
    const dest = fs.createWriteStream('/Users/david/xxx.html')

    self.google.drive.files.export({
      fileId: doc,
      mimeType: "text/html",
    }, {
            responseType: 'stream'
        }, (error, response) => {
        console.log("A")
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
    /*
    */
})

get.method = "drive.file.get"
get.requires = {
    google: {
        drive: _.is.Object,
    },
}
get.accepts = {
}
get.produces = {
}

/**
 */
const parameterized = (query, alt) => _.promise((self, done) => {
    _.promise(self) 
        .add({
            query: query || null,
            alt: alt || self.alt || null,
        })
        .then(get)
        .end(done, self)
})

/**
 *  API
 */
exports.get = get
exports.get.p = parameterized
