/*
 *  sheets/cell.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-06
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
            _range: self.google$range.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, cell_background)
})

cell_background.method = "sheets.cell.background"
cell_background.description = "Set cell background color"
cell_background.requires = {
    color: _.is.String,
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_background.accepts = {
    google$batch: _.is.Boolean,
    google$requests: _.is.Array,
}
cell_background.produces = {
    google$result: _.is.Dictionary,
    google$requests: _.is.Array,
}
cell_background.params = {
    color: _.p.normal,
}
cell_background.p = _.p(cell_background)

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
            _range: self.google$range.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, cell_color)
})

cell_color.method = "sheets.cell.color"
cell_color.description = "Set cell color color"
cell_color.requires = {
    color: _.is.String,
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_color.accepts = {
    google$batch: _.is.Boolean,
    google$requests: _.is.Array,
}
cell_color.produces = {
    google$result: _.is.Dictionary,
    google$requests: _.is.Array,
}
cell_color.params = {
    color: _.p.normal,
}
cell_color.p = _.p(cell_color)

/**
 */
const cell_font = _.promise((self, done) => {
    const google = require("..")

    _.promise.validate(self, cell_font)

    _.promise(self)
        .then(google.sheets.add_request.p("repeatCell", {
            cell: {
                userEnteredFormat: {
                    textFormat: {
                        fontFamily: self.font,
                    },
                },
            },
            fields: "userEnteredFormat(textFormat)",
            _range: self.google$range.range || null,
        }))
        /*
        .make(sd => {
            console.log("REQUESTS", JSON.stringify(sd.google$requests, null, 2))
        })
        */
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, cell_font)
})

cell_font.method = "sheets.cell.font"
cell_font.description = "Set cell text font"
cell_font.requires = {
    font: _.is.String, 
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_font.accepts = {
    google$batch: _.is.Boolean,
    google$requests: _.is.Array,
}
cell_font.produces = {
    google$result: _.is.Dictionary,
    google$requests: _.is.Array,
}
cell_font.params = {
    font: _.p.normal,
}
cell_font.p = _.p(cell_font)

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
                        fontSize: self.size,
                    },
                },
            },
            fields: "userEnteredFormat(textFormat)",
            _range: self.google$range.range || null,
        }))
        .conditional(!self.google$batch, google.sheets.batch)
        .end(done, self, cell_size)
})

cell_size.method = "sheets.cell.size"
cell_size.description = "Set cell text size"
cell_size.requires = {
    size: _.is.Number, 
    google$range: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
cell_size.accepts = {
    google$batch: _.is.Boolean,
    google$requests: _.is.Array,
}
cell_size.produces = {
    google$result: _.is.Dictionary,
    google$requests: _.is.Array,
}
cell_size.params = {
    size: _.p.normal,
}
cell_size.p = _.p(cell_size)

/**
 *  i.e. bold, italic, strikethrough, underline
 */
const _cell_style = _style => {
    const f = _.promise((self, done) => {
        const google = require("..")

        _.promise.validate(self, _cell_style)

        _.promise(self)
            .then(google.sheets.add_request.p("repeatCell", {
                cell: {
                    userEnteredFormat: {
                        textFormat: {
                            [ _style ]: self[_style] ? true : false,
                        },
                    },
                },
                fields: "userEnteredFormat(textFormat)",
                _range: self.google$range.range || null,
            }))
            .conditional(!self.google$batch, google.sheets.batch)

            .end(done, self, _cell_style)
    })

    f.method = `sheets.cell.${_style}`
    f.description = `Set cell ${_style}`
    f.requires = {
        [ _style ]: _.is.Boolean,
        google$range: {
            spreadsheetId: _.is.String,
        },
        google: {
            sheets: _.is.Object,
        },
    }
    f.accepts = {
        google$batch: _.is.Boolean,
        google$requests: _.is.Array,
    }
    f.produces = {
        google$result: _.is.Dictionary,
        google$requests: _.is.Array,
    }
    f.params = {
        [ _style ]: _.p.normal,
    }
    f.p = _.p(f)

    return f
}

/**
 *  API
 */
exports.cell = {}
exports.cell.background = cell_background
exports.cell.color = cell_color
exports.cell.font = cell_font
exports.cell.size = cell_size

exports.cell.bold = _cell_style("bold")
exports.cell.italic = _cell_style("italic")
exports.cell.strikethrough = _cell_style("strikethrough")
exports.cell.underline = _cell_style("underline")
