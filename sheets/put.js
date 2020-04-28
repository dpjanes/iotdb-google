/*
 *  sheets/put.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-02-13
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
const _util = require("./_util")

/**
 */
const put = _.promise((self, done) => {
    _.promise.validate(self, put)

    const params = {
        spreadsheetId: self.google$range.spreadsheetId,
        range: self.google$range.range,
        // valueInputOption: "RAW",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: self.jsons.map(json => _util.values(json)),
        },
    }

    // console.log("HERE:PUT", params.resource.values)

    self.google.sheets.spreadsheets.values.update(params, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        self.jsons = result.data.values
        
        done(null, self)
    })
})

put.method = "sheets.put";
put.requires = {
    jsons: _.is.Array.of.JSON,
    google$range: {
        spreadsheetId: _.is.String,
        range: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
put.produces = {
    google$result: _.is.Dictionary,
}

/**
 *  API
 */
exports.put = put
