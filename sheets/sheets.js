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
        spreadsheetId: self.google$range.spreadsheetId,
    }, (error, result) => {
        if (error) {
            return done(error)
        }
        
        self.google$result = result
        self.sheets = result.data.sheets
            .map(s => s.properties)
            .filter(s => s)
        
        done(null, self)
    })
})

sheets.method = "sheets"
sheets.requires = {
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
sheets.accepts = {
}
sheets.produces = {
    sheets: _.is.Array,
}

/**
 */
const select = _.promise(self => {
    _.promise.validate(self, select)

    self.sheet = self.sheets.find(sheet => sheet.title === self.title) || null
})

select.method = "sheets.select"
select.description = `Select a sheet by title`
select.requires = {
    sheets: _.is.Array.of.Dictionary,
    title: _.is.String,
}
select.accepts = {
}
select.produces = {
    sheet: _.is.Dictionary,
}

/**
 */
const select_p = title => _.promise((self, done) => {
    _.promise(self) 
        .add("title", title)
        .then(select)
        .end(done, self)
})

/**
 */
const query = _.promise(self => {
    _.promise.validate(self, query)

    if (!self.sheet) {
        throw new errors.NotFound("no sheet was selected")
    }

    self.google$range = _.d.clone(self.google$range)
    self.google$range.range = self.sheet.title
})

query.method = "sheets.query"
query.requires = {
    google$range: _.is.Dictionary,
}
query.accepts = {
    sheet: _.is.Dictionary,
}
query.produces = {
}

/**
 *  API
 */
exports.sheets = sheets
exports.sheets.select = select
exports.sheets.select.p = select_p
exports.sheets.query = query
