/*
 *  sheets/find_replace.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-04
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
 *  https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#findreplacerequest
 */
const find_replace = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, find_replace)

    const request = Object.assign(
        {
            find: self.find,
            replacement: self.replace,
        },
        {
            _range: self.query.range || null,
        },
        self.google$options || {},
    )

    if (_.is.RegExp(request.find)) {
        request.find = request.find.toString()
        request.find = request.find.substring(1, request.find.length - 1)
        request.searchByRegex = true
    }

    _.promise(self)
        .then(google.sheets.batch.add_request.p("findReplace", request))
        .then(google.sheets.batch.update)
        .end(done, self, "google$result,requests")
})

find_replace.method = "sheets.batch.update";
find_replace.requires = {
    query: _.is.Dictionary,
    google: {
        sheets: _.is.Object,
    },
    find: [ _.is.String, _.is.RegExp ],
    replace: _.is.String,
}
find_replace.accepts = {
    requests: _.is.Array,
}
find_replace.produces = {
    google$result: _.is.Dictionary,
    requests: _.is.Array,
}

/**
 */
const parameterized = (find, replace, options) => _.promise((self, done) => {
    _.promise(self) 
        .add({
            find: find,
            replace: replace,
            google$options: options,
        })
        .then(find_replace)
        .end(done, self, "requests,google$result")
})

/**
 *  API
 */
exports.find_replace = find_replace;
exports.find_replace.p = parameterized;
