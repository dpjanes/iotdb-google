/*
 *  sheets/cell.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-06
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

    /*
        "cell": {
          "userEnteredFormat": {
            "backgroundColor": {
              "red": 0.0,
              "green": 0.0,
              "blue": 0.0
            },
            "horizontalAlignment" : "CENTER",
            "textFormat": {
              "foregroundColor": {
                "red": 1.0,
                "green": 1.0,
                "blue": 1.0
              },
              "fontSize": 12,
              "bold": true
            }
          }
        },
        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
    */



/**
 */
const cell_background = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, cell_background)

    const color = new _.color.Color(self.color)

    _.promise(self)
        .then(google.sheets.batch.add_request.p("repeatCell", {
            cell: {
                userEnteredFormat: {
                    backgroundColor: {
                      red: color.r,
                      green: color.g,
                      blue: color.b,
                    },
                },
            },
            fields: "userEnteredFormat(backgroundColor)",
            _range: self.query.range || null,
        }))
        .then(google.sheets.batch.update)
        .end(done, self, "google$result")
})

cell_background.method = "sheets.cell.background"
cell_background.description = "Set cell background color"
cell_background.requires = {
    color: _.is.String,
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_background.produces = {
    google$result: _.is.Dictionary,
}

/**
 */
const cell_background_p = _color => _.promise((self, done) => {
    _.promise(self) 
        .add("color", _color)
        .then(cell_background)
        .end(done, self, "google$result")
})


/**
 *  API
 */
exports.cell = {}
exports.cell.background = cell_background
exports.cell.background.p = cell_background_p
