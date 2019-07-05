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
 *  https://developers.google.com/sheets/api/samples/sheet#determine_sheet_id_and_other_properties
 */
const properties = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, properties)

    self.google.sheets.spreadsheets.get({
        spreadsheetId: self.query.spreadsheetId,
        // field: "sheets.properties",
    }, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        self.properties = result.data
        
        done(null, self)
    })
})

properties.method = "properties.list";
properties.requires = {
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
properties.accepts = {
}
properties.produces = {
    google$result: _.is.Dictionary,
    properties: _.is.Dictionary,
}

/**
 *  API
 */
exports.properties = properties;
