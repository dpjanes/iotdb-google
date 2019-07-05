/*
 *  sheets/title.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-05
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
const title_set = _.promise((self, done) => {
    const google = require("..")

    _.promise(self)
        .validate(title_set)
        .add("requests", [
            {
                updateSpreadsheetProperties: {
                    properties: {
                        title: self.title,
                    },
                    fields: "title",
                },
            },
        ])
        .then(google.sheets.batch.update)
        .end(done, self, "google_result")
})

title_set.method = "sheets.title.set"
title_set.requires = {
    title: _.is.String,
    query: {
        spreadsheetId: _.is.String,
    },
    google: {
        sheets: _.is.Object,
    },
}
title_set.produces = {
    google_result: _.is.Dictionary,
}

/**
 */
const title_set_p = _title => _.promise((self, done) => {
    _.promise(self) 
        .add("title", _title)
        .then(title_set)
        .end(done, self, "google_result")
})

/**
 *  API
 */
exports.title = {}
exports.title.set = title_set
exports.title.set.p = title_set_p
