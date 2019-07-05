/*
 *  sheets/properties.js
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
const errors = require("iotdb-errors")

/**
 */
const sheets = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, sheets)

    self.google.sheets.spreadsheets.get({
        spreadsheetId: self.query.spreadsheetId,
    }, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        self.sheets = result.data.sheets
        
        done(null, self)
    })
})

sheets.method = "sheets"
sheets.requires = {
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
sheets.accepts = {
}
sheets.produces = {
    sheets: _.is.Dictionary,
}

/**
 *  API
 */
exports.sheets = sheets;
