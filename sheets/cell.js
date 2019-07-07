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
            "horizontalAlignment" : "CENTER",
            "textFormat": {
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
        .then(google.sheets.add_request.p("repeatCell", {
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
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, "google$result,requests")
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
cell_background.accepts = {
    google$batch: _.is.Boolean,
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
 */
const cell_color = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, cell_color)

    const color = new _.color.Color(self.color)

    _.promise(self)
        .then(google.sheets.add_request.p("repeatCell", {
            cell: {
                userEnteredFormat: {
                    textFormat: {
                        foregroundColor: {
                            red: color.r,
                            green: color.g,
                            blue: color.b,
                        },
                    },
                },
            },
            fields: "userEnteredFormat(textFormat)",
            _range: self.query.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, "google$result,requests")
})

cell_color.method = "sheets.cell.color"
cell_color.description = "Set cell color color"
cell_color.requires = {
    color: _.is.String,
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_color.accepts = {
    google$batch: _.is.Boolean,
}
cell_color.produces = {
    google$result: _.is.Dictionary,
}

/**
 */
const cell_color_p = _color => _.promise((self, done) => {
    _.promise(self) 
        .add("color", _color)
        .then(cell_color)
        .end(done, self, "google$result")
})

/**
 */
const cell_size = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, cell_size)

    _.promise(self)
        .then(google.sheets.add_request.p("repeatCell", {
            cell: {
                userEnteredFormat: {
                    textFormat: {
                        fontSize: self.size ? true : false,
                    },
                },
            },
            fields: "userEnteredFormat(textFormat)",
            _range: self.query.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, "google$result,requests")
})

cell_size.method = "sheets.cell.size"
cell_size.description = "Set cell text size"
cell_size.requires = {
    size: _.is.Number, 
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_size.accepts = {
    google$batch: _.is.Boolean,
}
cell_size.produces = {
    google$result: _.is.Dictionary,
}

/**
 */
const cell_size_p = _size => _.promise((self, done) => {
    _.promise(self) 
        .add("size", _size)
        .then(cell_size)
        .end(done, self, "google$result")
})

/**
 *  i.e. bold, italic, strikethrough, underline
 */
const _cell_style = style => _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, _cell_style)

    _.promise(self)
        .then(google.sheets.add_request.p("repeatCell", {
            cell: {
                userEnteredFormat: {
                    textFormat: {
                        [ style ]: self[style] ? true : false,
                    },
                },
            },
            fields: "userEnteredFormat(textFormat)",
            _range: self.query.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, "google$result,requests")
})

/**
 */
const _cell_style_p = style => _style => _.promise((self, done) => {
    _.promise(self) 
        .add(style, _style)
        .then(_cell_style(style))
        .end(done, self, "google$result")
})



/**
 *  API
 */
exports.cell = {}
exports.cell.background = cell_background
exports.cell.background.p = cell_background_p
exports.cell.color = cell_color
exports.cell.color.p = cell_color_p
exports.cell.size = cell_size
exports.cell.size.p = cell_size_p

exports.cell.bold = _cell_style("bold")
exports.cell.bold.p = _cell_style_p("bold")
exports.cell.italic = _cell_style("italic")
exports.cell.italic.p = _cell_style_p("italic")
exports.cell.strikethrough = _cell_style("strikethrough")
exports.cell.strikethrough.p = _cell_style_p("strikethrough")
exports.cell.underline = _cell_style("underline")
exports.cell.underline.p = _cell_style_p("underline")
