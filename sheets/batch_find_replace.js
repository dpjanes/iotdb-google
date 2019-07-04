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
const find_replace = (find, replace, options) => _.promise(self => {
    _.promise.validate(self, find_replace)

    self.requests = self.requests || []

    const request = Object.assign(
        {},
        options || {},
        {
            find: find,
            replacement: replace,
            range: self.query.range || null,
        },
    )

    /*
    if (!_.is.Nullish(request.sheetId)) {
    } else if (!_.is.Nullish(request.range)) {
    } else if (!_.is.Nullish(request.allSheets)) {
    } else if (self.query.range_cells) {
        request.range = self.query.range_cells
    } else {
        request.allSheets = true
    }

    // "searchByRegex": boolean,
    */

    self.requests.push({
        findReplace: request,
    })
})

find_replace.method = "sheets.batch.update";
find_replace.requires = {
    query: _.is.Dictionary,
    google: {
        sheets: _.is.Object,
    },
}
find_replace.accepts = {
    requests: _.is.Array,
}
find_replace.produces = {
    requests: _.is.Array,
}

/**
 *  API
 */
exports.find_replace = find_replace;
